import React from 'react';
import { ChatMessage, ChatState } from './types';
import { ChatContext } from './ChatContext';

export class Chat extends React.Component {
    static contextType = ChatContext;

    state: ChatState = {
        messages: [
            {
                message: 'Welcome!',
                author: 'Bot'
            }
        ],
        input: ''
    }

    componentDidMount () {

        //initiate socket connection
        this.context.init();

        const observable = this.context.onMessage();

        observable.subscribe((m: ChatMessage) => {
            let messages = this.state.messages;


            messages.push(m);
            this.setState({ messages: messages });
        });
    }

    componentWillUnmount () {
        this.context.disconnect();
    }

    render () {

        const updateInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
            this.setState({ input: e.target.value });
        }

        const handleMessage = (): void => {

            const author: string = 'Ross';

            if (this.state.input !== '') {
                this.context.send({
                    message: this.state.input,
                    author: author
                });
                this.setState({ input: '' });
            }
        };

        let msgIndex = 0;
        return (
            <div className="Chat">
                <div className="App-chatbox">
                    {this.state.messages.map((msg: ChatMessage) => {
                        msgIndex++;
                        return (
                            <div key={msgIndex}>
                                <p>{msg.author}</p>
                                <p>
                                    {msg.message}
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
                    <button onClick={() => { handleMessage() }}>
                        Send Message
                    </button>
                </p>
            </div>
        );
    }
}
