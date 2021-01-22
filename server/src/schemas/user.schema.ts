import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";


@Schema()
export class User {
    @Prop({required: true, minLength: 3})
    name: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true, minlength: 7})
    password: string;

    @Prop()
    status: string;
}
export const UserSchema = SchemaFactory.createForClass(User);