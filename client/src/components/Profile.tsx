import React, {useEffect, useState} from 'react';
import axios from "axios";

const API_SERVER = 'http://localhost:5000/user'

export const Profile = (props: { location: { state: any; }; }) => {
    let infoUser = props.location.state;
    const [person, setPerson] = useState(  infoUser || {
        _id: '',
        nickName: '',
        email: '',
    })
    // if (!(person?.email && person?.nickName)) {
    //     const token = localStorage.getItem('token');
    //     console.log(token)
    //     axios.get(API_SERVER, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     }).then((res) => {
    //         console.log('getdata', res.data)
    //         setPerson(res.data)
    //     }).catch((e)=>{
    //         console.log(e)
    //     })
    // }
    useEffect(()=> {
           console.log('useEffect', person)
    },[person])

    return (
        <div>
            Avatar
            <p>nickName: {person?.nickName}</p>
            <p>email: {person?.email}</p>
        </div>
    )
}