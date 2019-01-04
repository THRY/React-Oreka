import React, { Component } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import User from './pages/User';
import Messages from './pages/Messages';
import ForgotPassword from './pages/ForgotPassword';
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
          <Route path='/profile/' component={Profile}/>
          <Route path='/user/:value' component={User}/>
          <Route path='/messages/:value' component={Messages}/>
          <Route path='/messages' component={Messages}/>
          <Route path='/forgotpassword' component={ForgotPassword}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
