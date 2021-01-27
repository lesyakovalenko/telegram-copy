import { Document } from 'mongoose';

export interface ChatRoom extends Document {
    readonly _id: string;
    readonly creator: string;
    readonly name: string;
    readonly type: string;
    readonly connectedUsers: [];
}
