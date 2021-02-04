import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

@Schema()
export class ChatRoom {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ maxlength: 20 })
  name?: string;

  @Prop({ values: ['chat', 'group', 'channel'], default: 'chat' })
  type: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  connectedUsers: User[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
