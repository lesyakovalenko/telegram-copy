export interface IChatMessage {
    author: string;
    message: string;
}

export interface IChatState {
    input: string;
    messages: IChatMessage[];
}

export  interface IChatRoom {
    nickName: string;
    roomId: string;
}

