import React, {useEffect, useState} from 'react';
import * as userActions from '../actions/user'
import {Col, Container, Row} from "react-bootstrap";

export const Profile = () => {
    const [person, setPerson] = useState( {
        _id: '',
        nickName: '',
        email: '',
    })

    const load = async () => {
        const user = await userActions.getUser()
        setPerson(user)
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        {/*<Image src="holder.js/171x180" rounded />*/}
                    </Col>
                </Row>
            </Container>
            <p>nickName: {person?.nickName}</p>
            <p>email: {person?.email}</p>
        </div>
    )
}