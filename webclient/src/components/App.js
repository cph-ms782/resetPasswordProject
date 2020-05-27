// npm install react-bootstrap bootstrap

import React from "react";
import "../App.css"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink
} from "react-router-dom";

import Reset from "./Reset"
import Refresh from "./Refresh"
import Home from "./Home"


export default function App() {
  return (
    <Router>
      <div>
        <ul className="header">
          <li>
            <NavLink exact activeClassName="selected" to="/">Home</NavLink>
          </li>
          <li>
            <NavLink exact activeClassName="selected" to="/reset">Reset</NavLink>
          </li>
          <li>
            <NavLink exact activeClassName="selected" to="/refresh">Refresh</NavLink>
          </li>
        </ul>

        <hr />
          <div className="content">
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/reset">
                <Reset />
              </Route>
              <Route path="/refresh">
                <Refresh />
              </Route>
              
            </Switch>
          </div>
      </div>
    </Router>
  );
}
