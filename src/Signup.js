import React, { Component } from 'react';
import Layout from './components/Layout';
import { auth, signUp, signOut, logIn } from "./firebase";

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
    const onSignedUp = () => {
      this.props.history.push('/')
    }
    signUp(this.state.email, this.state.password, onSignedUp);
  }

  render() {
    return (
      <Layout>
        <p>Erstellen Sie Ihren eigenen Account:</p>
        <label htmlFor='email'>E-Mail-Adresse</label>
        <input type="text" name="email" id="email" onChange={this.handleEmail}></input>
        <label htmlFor='password'>Passwort</label>
        <input type="text" name="password" id="password" onChange={this.handlePassword}></input>
        <button onClick={this.handleSignUp}>Sign Up</button>    
      </Layout>  
    )
  }
}

export default Signin; 