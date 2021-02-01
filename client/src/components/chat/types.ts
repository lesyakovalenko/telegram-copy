export interface IChatMessage {
    author: string;
    text: string;
    chatRoom: string
}
export interface IChatTyping {
    author: string;
    typing: boolean;
    chatRoom: string
}

export interface IChatState {
    input: string;
    messages: IChatMessage[];
    isTyping: boolean;
}

export  interface IChatRoom {
    nickName: string;
    roomId: string;
}

export interface IAuthor {
    _id: string;
    email: string;
    nickName: string;
}

export interface IChat {
    _id: string;
    owner: {_id: string, nickName: string}
    connectedUsers?: {_id: string, nickName: string}[]
    type: string;
    name?: string;
}

export interface IOpenChat {
    _id: string;
    owner: {_id: string, nickName: string}
    connectedUsers: {_id: string, nickName: string}[]
    type: string;
    name: string;
}

