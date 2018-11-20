import React, { Component } from 'react';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom"; 
import './Style.scss';


class App extends Component {
  render() {
    return (  
      <Router>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/login' component={Login}/>
          <Route path='/signup' component={Signup}/>
          <Route path='/profile/:value' component={Profile}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
