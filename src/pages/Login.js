import React, { Component } from 'react';
import Layout from '../components/Layout';
import { logIn } from "../firebase";
import { Link } from "react-router-dom"; 
  

class Signin extends Component {
  state = {
    isSignedIn: false,
    loading: true,
    password: "",
    email: ""
  };  

  static contextTypes = {
    router: () => null, // replace with PropTypes.object if you use them
  }


  handlePassword = (e) => {
    this.setState ({
      password: e.target.value
    })
  }

  handleEmail = (e) => {
    this.setState ({
      email: e.target.value
    })
  }   

  handleLogIn = (e) => {
    e.preventDefault();

    const onLoggedIn = () => {
      this.props.history.push('/')
    }

    const onError = (errorMessage, errorCode) => {
      switch(errorCode) {
        case 'auth/invalid-email':
          errorMessage = 'Fehler: Bitte gebe Sie eine gültige E-Mail-Adresse an.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Fehler: Ihr Passwort muss mindestens 6 Zeichen enthalten.';
          break;
        case 'auth/email-already-in-use':
          errorMessage = 'Fehler: Diese E-Mail-Adresse wird bereits verwendet.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Fehler: Passwort oder E-Mail-Adresse falsch.';
          break;
        default: 
      }

      this.refs.errorRef.innerHTML = errorMessage;
    }
    
    logIn(this.state.email, this.state.password, onLoggedIn, onError);
  }

  render() {
    return (
      <Layout>
         <nav className="neutral">
          <div className="container">
            <a onClick={ this.context.router.history.goBack }>zurück</a>
            <span className="site-title">Melden Sie sich an</span>
          </div>
        </nav>
        <div className="container login">
          <form 
            onSubmit={ this.handleLogIn }>
            <div className="fields">
              <label htmlFor='email'>E-Mail-Adresse</label>
              <input type="email" name="email" id="email" onChange={this.handleEmail}></input>
              <label htmlFor='password'>Passwort</label>
              <input type="password" name="password" id="password" onChange={this.handlePassword}></input>
            </div>
            <p className="error-message" ref="errorRef"></p>
            <button type="submit">Anmelden</button>
            <div className="links">
              <p><Link to="/signup">Noch kein Login? Erstellen Sie hier eines.</Link></p>
              <p><Link to="/forgotpassword">Passwort vergessen?</Link></p>
            </div>
          </form>         
        </div>
      </Layout>  
    )
  }
}

export default Signin; 