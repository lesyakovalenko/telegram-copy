import {EChatType} from "../enums/chatType.enum";

export class CreateChatRoomDto {
    owner: string;
    name?: string;
    type: EChatType;
    connectedUsers?: string[]
}