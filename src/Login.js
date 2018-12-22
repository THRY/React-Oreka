import React, { Component } from 'react';
import Layout from './components/Layout';
import { auth, signUp, signOut, logIn } from "./firebase";
import { Link } from "react-router-dom"; 
  

class Signin extends Component {
  state = {
    isSignedIn: false,
    loading: true,
    password: "",
    email: ""
  };  

  handlePassword = (e) => {
    this.setState ({
      password: e.target.value
    })
    console.log(e.target.value);
  }

  handleEmail = (e) => {
    console.log(e.target.value);
    this.setState ({
      email: e.target.value
    })
  }   

  handleSignUp = () => {
    console.log(this.state);  
    signUp(this.state.email, this.state.password);
  }

  handleLogIn = () => {
    const onLoggedIn = () => {
      this.props.history.push('/')
    }

    const onError = (errorMessage) => {
      this.refs.errorRef.innerHTML = errorMessage;
    }
    
    logIn(this.state.email, this.state.password, onLoggedIn, onError);
  }

  render() {
    return (
      <Layout>
         <nav className="plakat">
          <div className="container">
            <Link to="/">zurück</Link>
            <span className="site-title">Melden Sie sich an</span>
          </div>
        </nav>
        <div className="container login">
          <p>Melden Sie sich hier an:</p>
          <label htmlFor='email'>E-Mail-Adresse</label>
          <input type="text" name="email" id="email" onChange={this.handleEmail}></input>
          <label htmlFor='password'>Passwort</label>
          <input type="text" name="password" id="password" onChange={this.handlePassword}></input>
          <button onClick={this.handleLogIn}>Log In</button>          
          <p ref="errorRef"></p>
          <p>Noch kein Login? Erstellen Sie <Link to="/signup">hier</Link> eines.</p>
        </div>
      </Layout>  
    )
  }
}

export default Signin; 