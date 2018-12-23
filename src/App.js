import React, { Component } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import User from './pages/User';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom"; 
import './main.scss';


class App extends Component {
  render() {
    return (  
      <Router>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/login' component={Login}/>
          <Route path='/signup' component={Signup}/>
          <Route path='/profile/:value' component={Profile}/>
          <Route path='/user/:value' component={User}/>
          
        </Switch>
      </Router>
    );
  }
}

export default App;
