import { Document } from 'mongoose';
import { User } from '../../user/interfaces/user.interface';
import { ChatRoom } from './chatRoom.interfaces';

export interface Message extends Document {
  _id: string;
  author: User;
  text: string;
  chatRoomId: ChatRoom;
  createdAt: Date;
}
