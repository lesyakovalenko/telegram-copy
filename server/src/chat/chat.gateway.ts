import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User} from "../user/interfaces/user.interface";
import {ChatRoom} from "./interfaces/chatRoom.interfaces";
import {Message} from "./interfaces/message.interface";
import {Socket} from "socket.io";
import {UseGuards} from "@nestjs/common";
import JwtAuthGuard from "../auth/JwtAuthGuard";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;
    users: number = 0;

    private userModel: Model<User>;
    private messageModel: Model<Message>;
    private chatRoomModel: Model<ChatRoom>;

    constructor(
        @InjectModel('User') userModel: Model<User>,
        @InjectModel('ChatRoom') chatRoomModel: Model<ChatRoom>,
        @InjectModel('Message') messageModel: Model<Message>) {

        this.userModel = userModel;
        this.messageModel = messageModel;
        this.chatRoomModel = chatRoomModel
    }

    async handleConnection() {
        this.users++;
        this.server.emit('users', this.users)
    }


    @SubscribeMessage('chat')
    async onChat(client, message) {
        console.log(message);
        client.broadcast.emit('chat', message);
    }

    async handleDisconnect(client: Socket) {
        const user = await this.userModel.findOne({clientId: client.id});
        if (user) {
            client.server.emit('users-changed', {user: user.nickname, event: 'left'});
            user.clientId = null;
            await this.userModel.findByIdAndUpdate(user._id, user);
        }
    }

    @SubscribeMessage('enter-chat-room')
    async enterChatRoom(client: Socket, data: { nickname: string, roomId: string }) {
        console.log(client)
        console.log(data)
        let user = await this.userModel.findOne({nickname: data.nickname});

        client.join(data.roomId).broadcast.to(data.roomId)
            .emit('users-changed', {user: user.nickName, event: 'joined'});
    }

    @SubscribeMessage('leave-chat-room')
    async leaveChatRoom(client: Socket, data: { nickName: string, roomId: string }) {
        const user = await this.userModel.findOne({nickName: data.nickName});
        client.broadcast.to(data.roomId).emit('users-changed', {user: user.nickName, event: 'left'});
        client.leave(data.roomId);
    }

    @SubscribeMessage('add-message')
    async addMessage(client: Socket, message: Message) {
        console.log(client)
        console.log(message)
        message.author = await this.userModel.findOne({clientId: client.id});
        message.createdAt = new Date();
        message = await this.messageModel.create(message);
        client.server.in(message.chatRoomId as string).emit('message', message);
    }
}