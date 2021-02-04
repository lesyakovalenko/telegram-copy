import React from 'react';
import {IAuthor, IChatMessage, IChatState, IChatTyping, IOpenChat} from './types';
import {ChatContext} from './ChatContext';
import * as chatAction from "../../actions/chat";

const _ = require('lodash');

interface PropsType {
    chatRoom: IOpenChat,
    activeUser: IAuthor,
    messageList: any[]
}

export class Chat extends React.Component<PropsType, {}> {
    static contextType = ChatContext;
    state: IChatState = {
        messages: [],
        input: '',
        isTyping: false,
        author: {
            _id: '',
            email: '',
            nickName: '',
        },
        chatRoom: {
            _id: '',
            owner: {_id: '', nickName: ''},
            connectedUsers: [{_id: '', nickName: ''}],
            type: '',
            name: ''
        }

    }

    constructor(props: PropsType | Readonly<PropsType>) {
        super(props)
        const {chatRoom, activeUser, messageList} = props;
        this.setState({
            messages: messageList,
            author: activeUser,
            chatRoom: chatRoom
        });
        this.updateMessageList = this.updateMessageList.bind(this)

    }

    updateMessageList(entry: ConcatArray<IChatMessage>) {
        this.setState({messages: this.state.messages.concat(entry)})
    }

    async loadListMessages(chatRoomId: string) {
        let list: any[];
        list = [];
        let messageList = await chatAction.getMessagesList(chatRoomId)
        console.log('messageList')
        if (messageList.length) {
            messageList.forEach((message: any) => {
                list.push({
                    author: message.author.nickName,
                    text: message.text,
                    chatRoom: message.chatRoom
                })
            })
        }
        console.log(list.length)
        this.setState({messages: list})
    }

    shouldComponentUpdate(nextProps: Readonly<PropsType>, nextState: Readonly<{}>, nextContext: any): boolean {
        let isSameMessageList = !(_.isEqual(nextProps.messageList, this.props.messageList))
        let isSameChatRoom = !(_.isEqual(nextProps.chatRoom, this.props.chatRoom))
        let isChangeRoom = !(_.isEqual(nextProps.chatRoom._id, this.props.chatRoom._id))
        let res = isSameChatRoom || isSameMessageList || isChangeRoom || !(nextProps.messageList.length === this.props.messageList.length)
        console.log(res);
        console.log('Check state',this.state.messages, nextState)
        return true
    }

    async componentDidMount() {
        const {chatRoom, activeUser, messageList} = this.props;
        this.setState({
            messages: messageList,
            author: activeUser,
            chatRoom: chatRoom
        });
        await this.loadListMessages(chatRoom._id)
        console.log('chatRoom: ', this.state.messages)
        //initiate socket connection
        this.context.init();
        const observableT = this.context.onTyping();

        observableT.subscribe((t: IChatTyping) => {
            console.log('on typing', t)
            this.setState({isTyping: t.typing});
        });
        const observable = this.context.onMessage();

        observable.subscribe((m: IChatMessage) => {
            let messages = this.state.messages;
            const authorName = this.state.chatRoom.connectedUsers?.find(user => user._id === m.author);
            let newMessage = {...m, author: (authorName?.nickName ?? 'author')};
            messages.push(newMessage);
            this.setState({messages: messages});
        });
    }

    componentWillUnmount() {
        this.context.disconnect();
    }

    render() {
        const handleTyping = () => {
            console.log('typing')
            this.context.typing({
                typing: true,
                author: this.state.author?._id,
                chatRoom: this.state.chatRoom?._id
            });
            // this.setState({input: ''});
        }
        const updateInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
            console.log('typing', e)
            handleTyping()
            this.setState({input: e.target.value});
        }

        const handleMessage = (): void => {
            if (this.state.input !== '') {
                this.context.send({
                    text: this.state.input,
                    author: this.state.author?._id,
                    chatRoom: this.state.chatRoom?._id
                });
                this.setState({input: ''});
            }
        };


        let msgIndex = 0;
        return (
            <div className="Chat">
                <div className="App-chatbox">
                    {this.state.messages.map((msg: IChatMessage) => {
                        msgIndex++;

                        return (
                            <div key={msgIndex}>
                                <p>{msg.author}</p>
                                <p>
                                    {msg.text}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <input
                    className="App-Textarea"
                    placeholder="Type your messsage here..."
                    onChange={updateInput}
                    value={this.state.input}
                />
                <p>
                    <button onClick={() => {
                        handleMessage()
                    }}>
                        Send Message
                    </button>
                </p>
            </div>
        );
    }
}
