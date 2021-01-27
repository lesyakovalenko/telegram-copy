import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message} from "./interfaces/message.interface";
import {NewMessageDto} from "./dto/new.message.dto";
import {ChatRoom} from "./interfaces/chatRoom.interfaces";
import {CreateChatRoomDto} from "./dto/create.chatRoom.dto";
import {EChatType} from "./enums/chatType.enum";
import {User} from "../user/interfaces/user.interface";


@Injectable()
export class ChatService {
    private messageModel: Model<Message>;
    private chatRoomModel: Model<ChatRoom>;
    private userModel: Model<User>;

    constructor(@InjectModel('Message') messageModel: Model<Message>,
                @InjectModel('ChatRoom') chatRoomModel: Model<ChatRoom>,
                @InjectModel('User') userModel: Model<User>) {
        this.messageModel = messageModel;
        this.chatRoomModel = chatRoomModel;
        this.userModel = userModel;
    }

    async getUserFromSocket() {
        // const cookie = socket.handshake.headers.cookie;
        // const { Authentication: authenticationToken } = parse(cookie);
        // const user = await this.authenticationService.getUserFromAuthenticationToken(authenticationToken);
        // if (!user) {
        //     throw new WsException('Invalid credentials.');
        // }
        // return user;
    }

    async saveMassage(newMessage: NewMessageDto) {
        const {text, author, chatRoom} = newMessage
        return await this.messageModel.create({
            text,
            author,
            chatRoom
        });
    }

    async getAllMessages(chatRoomId) {
        return this.messageModel.find({chatRoomId}).exec();
    }

    async createChatRoom(chatRoom: CreateChatRoomDto) {
        return await this.chatRoomModel.create({
            ...chatRoom
        })
    }
}
