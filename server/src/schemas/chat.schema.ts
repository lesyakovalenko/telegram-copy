import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import * as mongoose from "mongoose";


@Schema()
export class Chat {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: string;

    @Prop({required: true, minlength: 1})
    message: string;

}
export const ChatSchema = SchemaFactory.createForClass(Chat);