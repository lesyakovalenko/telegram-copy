import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


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

    joinedChatRooms?: []
}
export const UserSchema = SchemaFactory.createForClass(User);