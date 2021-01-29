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
import {UserService} from "../user/user.service";
import {ChatService} from "./chat.service";
import {NewMessageDto} from "./dto/new.message.dto";

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server;
    users: number = 0;

    private userModel: Model<User>;
    private messageModel: Model<Message>;
    private chatRoomModel: Model<ChatRoom>;

    constructor(
        private readonly userService: UserService,
        private readonly  chatService: ChatService,
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
        client.broadcast.emit('chat', message);
    }

    async handleDisconnect(client: Socket) {
        const user = await this.userModel.findOne({clientId: client.id});
        if (user) {
            client.server.emit('users-changed', {user: user.nickName, event: 'left'});
            user.clientId = null;
            await this.userModel.findByIdAndUpdate(user._id, user);
        }
    }

    @SubscribeMessage('enter-chat-room')
    async enterChatRoom(client: Socket, data: { nickname: string, roomId: string }) {
        let user = await this.userService.findUserByCondition({nickName: data.nickname});

        client.join(data.roomId).broadcast.to(data.roomId)
            .emit('users-changed', {user: user, event: 'joined'});
    }

    @SubscribeMessage('leave-chat-room')
    async leaveChatRoom(client: Socket, data: { nickname: string, roomId: string }) {
        let user = await this.userService.findUserByCondition({nickName: data.nickname});
        client.broadcast.to(data.roomId).emit('users-changed', {user: user, event: 'left'});
        client.leave(data.roomId);
    }

    @SubscribeMessage('add-message')
    async addMessage(client: Socket, message: NewMessageDto) {
        console.log(message)
        const newMessage = await this.chatService.saveMassage(message)
        client.server.in(message.chatRoom as string).emit('message', newMessage);
    }
}