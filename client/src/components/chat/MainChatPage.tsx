import {Button, Col, ListGroup, Row, Tab, Tabs, Container, Modal, InputGroup, FormControl} from "react-bootstrap";
import {SocketService} from "./socketService";
import {Chat} from "./Chat";
import {ChatContext} from './ChatContext';
import {BsFillPeopleFill, BsFillVolumeDownFill} from "react-icons/bs";
import React, {useEffect, useState} from "react";
import * as userActions from "../../actions/user";
import {IAuthor, IOpenChat} from "./types";
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
    const [showModal, setShowModal] = useState(false);
    const [listUsersForChat, setListUsersForChat] = useState<any[]>([])
    const [typeChat, setTypeChat] = useState<string>('')
    const [nameNewChat, setNameNewChat] = useState<string>('')
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
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

    useEffect(()=>{
        loadListMessages();
        console.log('listMessages', listMessages)
        console.log('activeChat', listMessages)
    }, [activeChat])


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
        setActiveChat(null)
        setShowChat(false)
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
        setActiveChat(null);
        setShowChat(false)
        console.log('getListChat', listChats);
    }

    const changeTab = (eventKey: string | null) => {
        console.log('change tab e', eventKey)
        if (eventKey === "chats") {
            getListChat()
        }
    }

    const setChatName = (chat: IOpenChat) => {
        let newChat = {...chat}
        if (!chat.hasOwnProperty('name')) {
            let connectedUsers = chat.connectedUsers;
            let userX = connectedUsers?.find(user => user.nickName !== author.nickName)
            newChat.name = (userX?.nickName ?? 'author');
        }
        return newChat;
    }
    let disabled: boolean = false;
    let active: boolean;

    const addPersonToChatGroup = (user: IUser) => {
        disabled = true;
        listUsersForChat.push(user._id);
        setListUsersForChat(listUsersForChat)
    }

    const createNewChatRoom = async () => {
        handleClose()
        console.log(listUsersForChat)
        const newChat = await chatAction.createNewChatRoom({
            type: typeChat,
            connectedUsers: listUsersForChat,
            name: nameNewChat
        })
        console.log(newChat)
    }

    const handleNewChannel = () => {
        setListUsersForChat([])
        handleShow();
        setTypeChat('channel');
    }
    const handleNewGroup = () => {
        setListUsersForChat([])
        handleShow();
        setTypeChat('group');
    }

    const handleChangeName = (event: any) => {
        console.log('event', event.target.value)
        setNameNewChat(event.target.value);
        console.log(nameNewChat)

    }
    return (
        <Container>
            <Row>
                <Col>
                    <Button variant={"dark"} onClick={handleNewChannel}><BsFillVolumeDownFill/>new Channel</Button>
                    <Button variant={"dark"} onClick={handleNewGroup}><BsFillPeopleFill/> new Group</Button>
                    <Modal show={showModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-default">Name: </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    value={nameNewChat}
                                    onChange={handleChangeName}
                                    aria-label="Default"
                                    aria-describedby="inputGroup-sizing-default"
                                />
                            </InputGroup>
                            <ListGroup>
                                {usersList.map((el: any) => (
                                    <ListGroup.Item active={active} disabled={disabled} action variant="dark"
                                                    onClick={() => (addPersonToChatGroup(el))}>{el?.nickName}</ListGroup.Item>
                                ))}
                                {/*//TODO: added scroll*/}

                            </ListGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={createNewChatRoom}>
                                Create {typeChat}
                            </Button>
                        </Modal.Footer>
                    </Modal>


                    <Tabs defaultActiveKey={"people"} onSelect={(eventKey) => {
                        changeTab(eventKey);
                    }}>
                        <Tab eventKey={"people"} title={"People"}>
                            <ListGroup>
                                {usersList.map((el: any) => (
                                    <ListGroup.Item action variant="dark"
                                                    onClick={() => (clickPerson(el))}>
                                        {el?.nickName}
                                    </ListGroup.Item>
                                ))}
                                {/*//TODO: added scroll*/}

                            </ListGroup>
                        </Tab>
                        <Tab eventKey={"chats"} title={"Chats"}>
                            <ListGroup>
                                {chats.map((el: any) => (
                                    <ListGroup.Item action variant="dark"
                                                    onClick={() => (clickChat(el))}>{el?.name}</ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Tab>

                    </Tabs>
                </Col>
                <Col>
                    {(showChat && activeChat && listMessages) ?
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