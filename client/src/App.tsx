import React from 'react';
import './App.scss';
import {Header} from "./components/Header";
import {Profile} from './components/Profile';
import {BrowserRouter as Router, Switch, Route, BrowserRouter} from 'react-router-dom'
import {AuthRoutes, NonAuthRoutes} from "./enums/routes.enum";
import {Login} from "./components/Login";
import {Register} from "./components/Register";
import {MainChatPage} from "./components/chat/MainChatPage";


function App() {

    return (
        <BrowserRouter>
            <div>
                <Header/>
            </div>
            <Router>
                <Switch>
                    <Route exact path={NonAuthRoutes.register} component={Register}/>
                    <Route exact path={NonAuthRoutes.login} component={Login}/>
                    <Route path={AuthRoutes.profile} component={Profile}/>
                    <Route path={AuthRoutes.chat} component={MainChatPage}/>

                </Switch>
            </Router>
        </BrowserRouter>

    );
}

export default App;
