export class JoinChatDto {
  _id: string;
  owner: { _id: string; nickName: string };
  connectedUsers?: { _id: string; nickName: string }[];
  type: string;
  name?: string;
}
