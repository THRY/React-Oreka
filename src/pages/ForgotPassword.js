
import React, { Component } from 'react';
import Layout from '../components/Layout';
import { auth, signUp, signOut, logIn } from "../firebase";
import { Link } from "react-router-dom"; 
  

class ForgotPassword extends Component {
  state = {
    isSignedIn: false,
    loading: true,
    password: "",
    email: ""
  };  

  static contextTypes = {
    router: () => null, // replace with PropTypes.object if you use them
  }

  handleEmail = (e) => {
    console.log(e.target.value);
    this.setState ({
      email: e.target.value
    })
  }   

  handleLogIn = () => {
    auth.sendPasswordResetEmail(this.state.email).then(function() {
      // Email sent
    }).catch((error) => {
      console.log(error.code);
      //this.props.history.push('/login');
      this.refs.errorRef.innerHTML = 'Eine Mail zum Zurücksetzen des Passwortes wurde an die oben angegebene Adresse geschickt.';
    });    
  }

  render() {
    return (
      <Layout>
         <nav className="plakat">
          <div className="container">
            <a onClick={ this.context.router.history.goBack }>zurück</a>
            <span className="site-title">Fordern Sie ein neues Passwort an</span>
          </div>
        </nav>
        <div className="container login">
          <div className="form">
            <div className="fields">
              <label htmlFor='email'>E-Mail-Adresse</label>
              <input type="text" name="email" id="email" onChange={this.handleEmail}></input>
            </div>
            <p className="error-message" ref="errorRef"></p>
            <button onClick={this.handleLogIn}>Senden</button>
          </div>         
        </div>
      </Layout>  
    )
  }
}

export default ForgotPassword; 