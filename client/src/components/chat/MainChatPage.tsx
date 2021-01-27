import {Grid} from "@material-ui/core";
import {Col, Row} from "react-bootstrap";
import {SocketService} from "./chatService";
import {Chat} from "./Chat";
import {ChatContext} from './ChatContext';
import {ChatList} from "./ChatList";

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

                    <Col>
                        <ChatList/>
                    </Col>
                    <Col>
                        <ChatContext.Provider value={chat}>
                        <Chat/>
                        </ChatContext.Provider>
                    </Col>

            </Row>
        </Grid>
    )
}