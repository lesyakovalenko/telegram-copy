import {Document, Model} from 'mongoose';
import {User} from "../../user/interfaces/user.interface";

export interface Message extends Document {
    _id: string;
    author: User;
    text: string;
    chatRoomId: {};
    createdAt: Date;
}