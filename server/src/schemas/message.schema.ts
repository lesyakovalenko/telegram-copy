import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {User} from "./user.schema";
import {ChatRoom} from "./chatRoom.schema";

@Schema()
export class Message {
    @Prop({ required: true, ref: 'User' })
    author: User;

    @Prop({required: true, minlength: 1})
    text: string;

    @Prop({required: true, ref: 'ChatRoom'})
    chatRoomId: ChatRoom;

    @Prop({required: true})
    createdAt: Date;
}
export const MessageSchema = SchemaFactory.createForClass(Message);