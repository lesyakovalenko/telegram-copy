import {Button, Col, ListGroup, Row, Tab, Tabs, Container} from "react-bootstrap";
import {SocketService} from "./socketService";
import {Chat} from "./Chat";
import {ChatContext} from './ChatContext';
import {BsFillPeopleFill, BsFillVolumeDownFill} from "react-icons/bs";
import React, {useEffect, useState} from "react";
import * as userActions from "../../actions/user";
import {IAuthor,  IOpenChat} from "./types";
import {IUser} from "../../interfaces/user.interface";
import * as chatAction from "../../actions/chat"

const socketService = new SocketService();

export const MainChatPage = () => {
    const [usersList, setUsersList] = useState<any[]>([])
    const [chats, setChats] = useState<IOpenChat[]>([])
    const [author, setAuthor] = useState<IAuthor>({
        _id: '',
        nickName: '',
        email: ''
    })
    const [showChat, setShowChat] = useState<boolean>(false)
    const [activeUser, setActiveUser] = useState({
        _id: '',
        nickName: '',
        email: '',
    })
    const [activeChat, setActiveChat] = useState<IOpenChat | null>(null)
    const [listMessages, setListMessages] = useState<any[]>([])
    const load = async () => {
        const list = await userActions.getUsersListExUser();
        setUsersList(list);

        const user: IUser = await userActions.getUser();
        setAuthor({
            _id: user._id,
            email: user.email,
            nickName: user.nickName
        })
        const chatList = user?.joinedChatRooms;
        if (chatList) {
            setChats(chatList);
            setShowChat(true)
        } else {
            setShowChat(false)
        }
    }

    let loadListMessages = async () => {
        let list: any[];
        list = [];
        if (activeChat) {
            let messageList = await chatAction.getMessagesList(activeChat._id)
            console.log(messageList)
            if (messageList.length) {
                messageList.forEach((message: any) => {
                    list.push({
                        author: message.author.nickName,
                        text: message.text,
                        chatRoom: message.chatRoom
                    })
                })
            }
        }
        console.log(list.length)
        setListMessages(list)

    }

    useEffect(() => {
        load()
    }, [])
    useEffect(() => {
        if (activeChat) {
            loadListMessages();
        }
    }, [showChat, activeChat]);

    let listItems, listChat;
    let item;
    const clickPerson = async (user: IUser) => {
        setActiveChat(null)
        setShowChat(false)
        console.log(user)
        setActiveUser({
            _id: user._id,
            email: user.email,
            nickName: user.nickName
        });
        let chat = await chatAction.findChatWithUser(user._id);
        if (chat) {
            console.log('click chat true', chat)
            setActiveChat(chat)
            //TODO show chat
            setShowChat(true)
        } else {
            console.log('click chat false', chat)
            setActiveChat(null)
            setShowChat(false)
        }
        console.log('chat', chat);
    }

    const clickChat = (chat: IOpenChat) => {
        console.log(chat)
        setActiveChat(chat);
        setShowChat(true)

    }
    const createChat = async () => {
        const chat: IOpenChat = await chatAction.createNewChat(activeUser._id);
        const newChat: IOpenChat = setChatName(chat);
        setActiveChat(newChat);
        setShowChat(true)
    }

    const getListChat = async () => {
        const listChats = await chatAction.getChatListByUser();
        const newListChats = listChats.map((item: IOpenChat) => {
            return item.hasOwnProperty('name') ? item : setChatName(item)
        })
        setChats(newListChats);
        console.log('getListChat', listChats);
    }

    const changeTab = (eventKey: string | null) => {
        console.log('change tab e', eventKey)
        if (eventKey == "chats") {
            getListChat()
        }
    }

    const setChatName = (chat: IOpenChat) => {
        let newChat = {...chat}
        if (!chat.hasOwnProperty('name')) {
            let connectedUsers = chat.connectedUsers;
            let userX = connectedUsers?.find(user => user.nickName != author.nickName)
            newChat.name = (userX?.nickName ?? 'author');
        }
        return newChat;
    }

    return (
        <Container>
            <Row>

                <Col>
                    <Button variant={"dark"}><BsFillVolumeDownFill/>new Channel</Button>
                    <Button variant={"dark"}><BsFillPeopleFill/> new Group</Button>
                    <Tabs defaultActiveKey={"people"} onSelect={(eventKey) => {
                        changeTab(eventKey);
                    }}>
                        <Tab eventKey={"people"} title={"People"}>
                            <ListGroup>
                                {listItems = usersList.map((el: any) => (


                                    <ListGroup.Item action variant="dark"
                                                    onClick={() => (clickPerson(el))}>{el?.nickName}</ListGroup.Item>
                                ))}
                                {/*//TODO: added scroll*/}

                            </ListGroup>
                        </Tab>
                        <Tab eventKey={"chats"} title={"Chats"}>
                            <ListGroup>
                                {listChat = chats.map((el: any) => (
                                    <ListGroup.Item action variant="dark"
                                                    onClick={() => (clickChat(el))}>{el?.name}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Tab>

                    </Tabs>
                </Col>
                <Col>
                    {item = (showChat && activeChat && listMessages) ?
                        <div>
                            <ChatContext.Provider value={socketService}>
                                <Chat chatRoom={activeChat} activeUser={author} messageList={listMessages}></Chat>
                            </ChatContext.Provider>
                        </div> : <Button onClick={createChat}>Join chat</Button>

                    }
                </Col>
            </Row>
        </Container>
    )
}