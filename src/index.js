import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Body from "./Componant/body";
import NavBar from "./Componant/NavBar";
import CallBorad from "./Componant/CallBord";
import CallRoom from "./Componant/CallRoom";
import "bootstrap/dist/css/bootstrap.min.css";


import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.Fragment>

    <Router>
        <NavBar></NavBar>

        <Switch>     
        <Route path="/CallBorad/:room" component={CallBorad} />
        <Route path="/CallRoom/:room" component={CallRoom} />
        <Route path="/" component={Body} />

            </Switch>
            
    </Router>
        </React.Fragment>
        ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
