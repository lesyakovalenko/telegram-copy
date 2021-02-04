import { EChatType } from '../enums/chatType.enum';

export class CreateChatDto {
  owner: string;
  name?: string;
  type: EChatType;
  connectedUsers?: string[];
}
