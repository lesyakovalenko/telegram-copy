import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {ChatRoom} from "./chatRoom.schema";

@Schema()
export class User {
    @Prop({required: true, minLength: 3, unique: true})
    nickName: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true, minlength: 7})
    password: string;

    @Prop()
    status: string;

    @Prop()
    avatar?: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' }] })
    joinedChatRooms?: ChatRoom[]
}
export const UserSchema = SchemaFactory.createForClass(User);