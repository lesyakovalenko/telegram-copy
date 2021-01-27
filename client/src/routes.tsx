import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthRoutes, NonAuthRoutes} from "./enums/routes.enum";
import {token} from "./utils/api";
import {Register} from "./components/auth/Register";
import {Login} from "./components/auth/Login";
import {Profile} from "./components/Profile";
import {MainChatPage} from "./components/chat/MainChatPage";

export const useRoutes = () => {
    if (token) {
        return (
            <Switch>
                <Route exact path={AuthRoutes.profile} component={Profile}/>
                <Route exact path={AuthRoutes.chat} component={MainChatPage}/>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route exact path={NonAuthRoutes.register} component={Register}/>
            <Route exact path={NonAuthRoutes.login} component={Login}/>
            <Redirect to='/login'/>
        </Switch>
    )
}