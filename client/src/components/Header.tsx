import React, {useEffect, useState} from 'react'
import {Nav, Navbar} from "react-bootstrap";
import {BsChatSquareDotsFill, BsFillPersonFill} from "react-icons/bs";
import {IoLogOutSharp} from "react-icons/all";
import {ls} from "../utils/api";
import './header.css';
import {token} from '../utils/api';

export const Header = ()=> {
    const [linkAuthActive, setLinkAuthActive]= useState(false)
    const logout = ()=>{
        ls.removeAll()
    };
    const isLogin= ()=> {
        return !!(token)
    }

    useEffect(()=>{
        setLinkAuthActive(!isLogin())

    }, [])
    return (
        <div>
            <Navbar bg="light">
                <Navbar.Brand>Chat</Navbar.Brand>
                <Nav className="justify-content-start">
                    <Nav.Link href={'/profile'}><BsFillPersonFill/></Nav.Link>
                    <Nav.Link href={'/chat'}><BsChatSquareDotsFill/></Nav.Link>
                    <Nav.Link href={'/login'} onClick={logout}><IoLogOutSharp/></Nav.Link>
                </Nav>
                {linkAuthActive ?(<Nav className="justify-content-end">
                    <Nav.Link href={'/register'}>Register</Nav.Link>
                    <Nav.Link href={'/login'}>Login</Nav.Link>
                </Nav>): null}
            </Navbar>
        </div>
    );
}
