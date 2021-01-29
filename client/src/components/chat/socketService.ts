import io from 'socket.io-client';
import {IChatMessage, IChatRoom} from './types';
import {fromEvent, Observable} from 'rxjs';

export class SocketService {
    private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

    public init(): SocketService {
        console.log('initiating socket service');
        let token = localStorage.getItem('token');
        this.socket = io('localhost:5000')
        return this;
    }

    // send a message for the server to broadcast
    public send(message: IChatMessage): void {
        console.log('emitting message: ' + message);
        this.socket.emit('add-message', message);
    }

    public leaveChatRoom(chatRoom: IChatRoom) {
        this.socket.emit('leave-chat-room', chatRoom);
    }

    public enterChatRoom(chatRoom: IChatRoom) {
        this.socket.emit('enter-chat-room', chatRoom)
    }

    // link message event to rxjs data source
    public onMessage(): Observable<IChatMessage> {
        return fromEvent(this.socket, 'message');
    }

    // disconnect - used when unmounting
    public disconnect(): void {
        this.socket.disconnect();
    }
}