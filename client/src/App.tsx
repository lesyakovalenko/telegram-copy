import React from 'react';
import './App.scss';
import {Header} from "./components/Header";
import {BrowserRouter} from 'react-router-dom'
import {useRoutes} from "./routes";


function App() {
    const routes = useRoutes()
    return (
        <BrowserRouter>
            <div>
                <Header/>
                {routes}
            </div>
        </BrowserRouter>
    );
}

export default App;
