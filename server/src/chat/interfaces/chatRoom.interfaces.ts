import { Document } from 'mongoose';
import { User } from '../../user/interfaces/user.interface';

export interface ChatRoom extends Document {
  readonly _id: string;
  readonly owner: User;
  readonly name: string;
  readonly type: string;
  readonly connectedUsers: [];
}
