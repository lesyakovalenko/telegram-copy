import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {User} from "./user.schema";
import {ChatRoom} from "./chatRoom.schema";
import * as mongoose from "mongoose";

@Schema()
export class Message {
    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    author: User;

    @Prop({required: true, minlength: 1})
    text: string;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom'})
    chatRoom: ChatRoom;

    @Prop({required: true})
    createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);