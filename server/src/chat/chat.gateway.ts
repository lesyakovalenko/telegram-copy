import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/interfaces/user.interface';
import { ChatRoom } from './interfaces/chatRoom.interfaces';
import { Message } from './interfaces/message.interface';
import { Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { NewMessageDto } from './dto/new.message.dto';
import { TypingDto } from './dto/typing.dto';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/ws.jwt.guard';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  users = 0;
  wsClients = [];

  private userModel: Model<User>;
  private messageModel: Model<Message>;
  private chatRoomModel: Model<ChatRoom>;

  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    @InjectModel('User') userModel: Model<User>,
    @InjectModel('ChatRoom') chatRoomModel: Model<ChatRoom>,
    @InjectModel('Message') messageModel: Model<Message>,
  ) {
    this.userModel = userModel;
    this.messageModel = messageModel;
    this.chatRoomModel = chatRoomModel;
  }

  async handleConnection(client: Socket, user) {
    console.log('connection', user);
    this.users++;
    console.log(`Client connected: ${client.id}`);
    this.server.emit('users', this.users);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.userModel.findOne({ clientId: client.id });
    console.log('handle disconect', user);

    if (user) {
      client.server.emit('users-changed', {
        user: user.nickName,
        event: 'left',
      });
      user.clientId = ' ';
      user.save();
      await this.userModel.findByIdAndUpdate(user._id, user);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('enter-chat-room')
  async enterChatRoom(
    client: Socket,
    data: { nickname: string; roomId: string },
  ) {
    const user = await this.userService.findUserByCondition({
      nickName: data.nickname,
    });
    console.log('client.id', client.id);
    user.clientId = client.id;
    user.save();
    client
      .join(data.roomId)
      .broadcast.to(data.roomId)
      .emit('users-changed', { user: user.nickName, event: 'joined' });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave-chat-room')
  async leaveChatRoom(
    client: Socket,
    data: { nickname: string; roomId: string },
  ) {
    const user = await this.userService.findUserByCondition({
      nickName: data.nickname,
    });
    client.broadcast
      .to(data.roomId)
      .emit('users-changed', { user: user.nickName, event: 'left' });
    client.leave(data.roomId);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('add-message')
  async addMessage(client: Socket, message: NewMessageDto) {
    console.log(message);
    const newMessage = await this.chatService.saveMassage(message);
    client.server.in(message.chatRoom as string).emit('message', newMessage);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('add-typing')
  async addTyping(client: Socket, typing: TypingDto) {
    client.server.in(typing.chatRoom as string).emit('typing', typing);
  }

  // @UseGuards(WsJwtGuard)
  // @SubscribeMessage('prev-list-messages')
  // async getListMessage(client: Socket, chatRoom: string) {
  //   const listMessages = await this.chatService.getAllMessages(chatRoom);
  //   console.log(listMessages);
  //   console.log(client.server.in(chatRoom as string));
  //   client.server.in(chatRoom as string).emit('list-messages', listMessages);
  // }
}
