import io from 'socket.io-client';
import {IChatMessage, IChatRoom, IChatTyping} from './types';
import {fromEvent, Observable} from 'rxjs';
import {token} from '../../utils/api';

export class SocketService {
    private socket: SocketIOClient.Socket = {} as SocketIOClient.Socket;

    public init(): SocketService {
        console.log('initiating socket service');
        this.socket = io('localhost:5000', {query: {token: token}})
        return this;
    }

    // send a message for the server to broadcast
    public send(message: IChatMessage): void {
        console.log('emitting message: ' + message);
        this.socket.emit('add-message', message);
    }
    public typing(typing: IChatTyping): void {
        console.log('emitting typing: ' + typing);
        this.socket.emit('add-typing', typing);
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
    public onTyping(): Observable<IChatTyping> {
        return fromEvent(this.socket, 'typing');
    }

    public onJoined(): Observable<any>{
        return fromEvent(this.socket, 'joined');
    }

    // disconnect - used when unmounting
    public disconnect(): void {
        this.socket.disconnect();
    }
    public connect(): void {
        this.socket.connect();
    }
}