import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './interfaces/message.interface';
import { NewMessageDto } from './dto/new.message.dto';
import { ChatRoom } from './interfaces/chatRoom.interfaces';
import { CreateChatDto } from './dto/create.chat.dto';
import { EChatType } from './enums/chatType.enum';
import { User } from '../user/interfaces/user.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  private messageModel: Model<Message>;
  private chatRoomModel: Model<ChatRoom>;
  private userModel: Model<User>;

  constructor(
    @InjectModel('Message') messageModel: Model<Message>,
    @InjectModel('ChatRoom') chatRoomModel: Model<ChatRoom>,
    @InjectModel('User') userModel: Model<User>,
    private readonly userService: UserService,
  ) {
    this.messageModel = messageModel;
    this.chatRoomModel = chatRoomModel;
    this.userModel = userModel;
  }

  async saveMassage(newMessage: NewMessageDto) {
    const { text, author, chatRoom } = newMessage;
    return await this.messageModel.create({
      text,
      author,
      chatRoom,
      createdAt: new Date(),
    });
  }

  async getAllMessages(chatRoomId) {
    return await this.messageModel
      .find({ chatRoom: chatRoomId })
      .populate({ path: 'author', select: '_id nickName' })
      .sort({ createdAt: 'asc' });
  }

  async getChatListByUser(userId: string) {
    return this.userService.findUserByIdWithJoinChatList(userId);
  }

  async getChatBetweenUsers(oneUserId, twoUserId) {
    const chat = await this.chatRoomModel
      .findOne({
        $or: [{ owner: oneUserId }, { owner: twoUserId }],
        $and: [{ connectedUsers: oneUserId }, { connectedUsers: twoUserId }],
        type: EChatType.chat,
      })
      .populate({ path: 'connectedUsers' })
      .sort('type');
    console.log(chat);
    return chat;
  }

  async createNewChat(ownerId, connectedUserId) {
    const createChat = await this.chatRoomModel.create({
      type: EChatType.chat,
      owner: ownerId,
      connectedUsers: [ownerId, connectedUserId],
    });
    await this.userService.addJoinChat(ownerId, createChat._id);
    await this.userService.addJoinChat(connectedUserId, createChat._id);
    return createChat;
  }

  async createNewChatRoom(newChatRoom: CreateChatDto) {
    newChatRoom.connectedUsers.push(newChatRoom.owner);

    const createChat = await this.chatRoomModel.create({
      ...newChatRoom,
    });

    newChatRoom.connectedUsers.forEach((item) => {
      //TODO
      this.userService.addJoinChat(item, createChat._id);
    });
    return createChat;
  }
}
