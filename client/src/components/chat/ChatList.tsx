import React, {useEffect, useState} from 'react'
import {ListGroup, Tab, Tabs} from "react-bootstrap";
import * as userActions from "../../actions/user";
import './style.scss';
import {BsFillPeopleFill, BsFillVolumeDownFill, BsPeople} from "react-icons/bs";

export const ChatList = () => {
    const [usersList, setUsersList] = useState<any[]>([])
    const load = async () => {
        const list = await userActions.getUsersList()
        setUsersList(list)

    }

    useEffect(() => {
        load()
    }, [])
    let listItems;
    const onClick = (user: any)=> {
        console.log(user)
    }

    return (

          <Tabs defaultActiveKey={"people"}>
              <Tab eventKey={"people"} title={"People"}>
                  <ListGroup>
                      <ListGroup.Item action><BsFillVolumeDownFill/>new Channel</ListGroup.Item>
                      <ListGroup.Item action><BsFillPeopleFill/> new Group</ListGroup.Item>
                      {listItems = usersList.map((el: any) => (
                          <ListGroup.Item action onClick={()=>(onClick(el))}>{el?.nickName}</ListGroup.Item>
                      ))}
                      {/*//TODO: added scroll*/}

                  </ListGroup>
              </Tab>
              <Tab eventKey={"chats"} title={"Chats"}>
                  <ListGroup>
                      <ListGroup.Item action><BsFillVolumeDownFill/>new Channel</ListGroup.Item>
                  </ListGroup>
              </Tab>

          </Tabs>



    )
}