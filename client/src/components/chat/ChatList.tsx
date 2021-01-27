import React, {useEffect, useState} from 'react'
import {Button, ButtonGroup, ListGroup} from "react-bootstrap";
import * as userActions from "../../actions/user";

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
        // <ButtonGroup vertical>
        //     {listItems = usersList.map((el: any) => (
        //         <Button onClick={()=>(onClick(el))}>{el?.nickName}</Button>
        //     ))}
        //     </ButtonGroup>
        <ListGroup>
            {listItems = usersList.map((el: any) => (
                <ListGroup.Item action onClick={()=>(onClick(el))}>{el?.nickName}</ListGroup.Item>
            ))}
            {listItems = usersList.map((el: any) => (
                <ListGroup.Item action onClick={()=>(onClick(el))}>{el?.nickName}</ListGroup.Item>
            ))}
            {listItems = usersList.map((el: any) => (
                <ListGroup.Item action onClick={()=>(onClick(el))}>{el?.nickName}</ListGroup.Item>
            ))}
        </ListGroup>
    )
}