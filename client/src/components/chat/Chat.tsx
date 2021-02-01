import React from 'react';
import {IAuthor, IChatMessage, IChatState, IChatTyping, IOpenChat} from './types';
import {ChatContext} from './ChatContext';

const _ = require('lodash');

interface PropsType {
    chatRoom: IOpenChat,
    activeUser: IAuthor,
    messageList: any[]
}

export class Chat<Props> extends React.Component<PropsType, {}> {
    static contextType = ChatContext;
    author: IAuthor = {
        _id: '',
        email: '',
        nickName: '',
    };
    chatRoom: IOpenChat = {
        _id: '',
        owner: {_id: '', nickName: ''},
        connectedUsers: [{_id: '', nickName: ''}],
        type: '',
        name: ''
    };

    state: IChatState = {
        messages: [],
        input: '',
        isTyping: false
    }

    constructor(props: PropsType | Readonly<PropsType>) {
        super(props)
    }

    shouldComponentUpdate(nextProps: Readonly<PropsType>, nextState: Readonly<{}>, nextContext: any): boolean {
               console.log('nextProps', nextProps)
        console.log('nextState', nextState)
        console.log('oldState', this.state)
        console.log('oldProps', this.props)
        let isSameMessageList = !(_.isEqual(nextProps.messageList, this.props.messageList))
        let isSameChatRoom = !(_.isEqual(nextProps.chatRoom, this.props.chatRoom))
        let isChangeRoom = !(_.isEqual(nextProps.chatRoom._id, this.props.chatRoom._id))
        let res = isSameChatRoom || isSameMessageList || isChangeRoom || !(nextProps.messageList.length == this.props.messageList.length)
        console.log(res);
        return true
    }

    componentDidUpdate(prevProps: Readonly<PropsType>, prevState: Readonly<{}>, snapshot?: any) {
       console.log(prevProps)
        console.log('componentDidUpdate',this.props)
        const {chatRoom, activeUser, messageList} = this.props;
        console.log('this.props', this.props)
        this.author = activeUser;
        this.chatRoom = chatRoom;
        console.log('chatRoom: ', chatRoom._id)
        this.state.messages = messageList;
    }

    async componentDidMount() {
        const {chatRoom, activeUser, messageList} = this.props;
        console.log('this.props', this.props)
        this.author = activeUser;
        this.chatRoom = chatRoom;
        console.log('chatRoom: ', chatRoom._id)
        this.state.messages = messageList;
        console.log('chatRoom: ', this.state.messages )
        //initiate socket connection
        this.context.init();
        this.context.enterChatRoom({
            roomId: chatRoom._id,
            nickName: activeUser.nickName
        })
        const observableT = this.context.onTyping();

        observableT.subscribe((t: IChatTyping) => {
            console.log('on typing', t)
            this.setState({isTyping: t.typing});
        });
        const observable = this.context.onMessage();

        observable.subscribe((m: IChatMessage) => {
            let messages = this.state.messages;
            const authorName = this.chatRoom.connectedUsers.find(user => user._id === m.author);
            let newMessage = {...m, author: (authorName?.nickName ?? 'author')};
            messages.push(newMessage);
            this.setState({messages: messages});
        });
    }

    componentWillUnmount() {
        this.context.disconnect();
    }

    render() {
        const handleTyping = ()=>{
            console.log('typing')
                this.context.typing({
                    typing: true,
                    author: this.author?._id,
                    chatRoom: this.chatRoom?._id
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
                    author: this.author?._id,
                    chatRoom: this.chatRoom?._id
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
