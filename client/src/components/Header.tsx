import React from 'react'
import {Nav, Navbar} from "react-bootstrap";
import {BsChatSquareDotsFill, BsFillPersonFill} from "react-icons/bs";
import {IoLogOutSharp} from "react-icons/all";
export const Header = ()=> {
    return (
        <div>
            <Navbar bg="light">
                <Navbar.Brand>Chat</Navbar.Brand>
                <Nav className="justify-content-end">
                    <Nav.Link href={'/profile'}><BsFillPersonFill/></Nav.Link>
                    <Nav.Link href={'/chat'}><BsChatSquareDotsFill/></Nav.Link>
                    <Nav.Link><IoLogOutSharp/></Nav.Link>
                </Nav>
            </Navbar>
        </div>
    );
}
