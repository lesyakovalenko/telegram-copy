import React, {useEffect, useState} from 'react';
import * as userActions from '../actions/user'

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
        console.log('useEffect', person)
        load()
    }, [])

    return (
        <div>
            Avatar
            <p>nickName: {person?.nickName}</p>
            <p>email: {person?.email}</p>
        </div>
    )
}