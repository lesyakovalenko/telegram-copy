import {Grid} from "@material-ui/core";
import {Col, Row} from "react-bootstrap";
import {SocketService} from "./chatService";
import {Chat} from "./Chat";
import { ChatContext } from './ChatContext';
const chat = new SocketService();

export const MainChatPage = () => {
    return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                <Row>
                    <Col>List User</Col>
                    <Col>
                        <ChatContext.Provider value={chat}>
                            <Chat/>
                            </ChatContext.Provider>
                    </Col>
                </Row>
            </Grid>
        // <Grid
        //     container
        //     direction="column"
        //     justify="center"
        //     alignItems="center"
        // >
        //     <Grid> List user</Grid>
        //     <Grid> chat</Grid>
        // </Grid>
    )
}