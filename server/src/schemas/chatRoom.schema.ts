import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

@Schema()
export class ChatRoom {
    @Prop({ required: true, ref: 'User' })
    creator: string;

    @Prop({required: true, maxlength: 20})
    name: string;

    @Prop( {values: ['chat', 'group', 'channel'],default: 'chat'} )
    type: string;

    @Prop()
    connectedUsers: []

}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);