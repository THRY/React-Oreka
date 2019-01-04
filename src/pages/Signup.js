import React, { Component } from 'react';
import Layout from '../components/Layout';
import { auth, signUp, signOut, logIn, db} from "../firebase";
import { Link } from "react-router-dom";
import StatusSelector from '../components/StatusSelector.js'
import '../Stylesheets/pages/signup.scss'; 


class Signin extends Component {
  state = {
    isSignedIn: false,
    loading: true,
    password: "",
    email: "",
    userValues: {
      status: 'suche',
      birthdate: "",
      categories: {},
      description: "",
      public: false,
      spezialDescr: "",
      profilePic: "",
      profilePicUrl: "",
      username: "",
      user: "",
      location: ""
    }
  };  

  static contextTypes = {
    router: () => null, // replace with PropTypes.object if you use them
  }


  handlePassword = (e) => {
    this.setState ({
      password: e.target.value
    })
    console.log(e.target.value);
  }

  handleEmail = (e) => {
    const email = e.target.value;
    console.log(email);

    this.setState(prevState => ({
        email: email,
        userValues: {
          ...prevState.userValues,
          email: email
        }
      })
    )
  }   

  handleUsername = (e) => {
    const username = e.target.value;
    console.log(username);

    this.setState(prevState => ({
        username: username,
        userValues: {
          ...prevState.userValues,
          username: username
        }
      })
    )
  }   

  handleSignUp = () => {
    const onSignedUp = () => {
      const userId = auth.currentUser.uid;
      console.log(userId)

      localStorage.setItem('user', userId);

      this.setState(prevState => ({
        userValues: {
          ...prevState.userValues,
          user: userId
        }
      }), () => {
        this.createUserProfile();
        this.props.history.push(`/profile/${userId}`)
      })
    }

    const onError = (errorMessage, errorCode) => {
      console.log(errorCode + ' ' + errorMessage);

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
        default: 
      }
      document.getElementsByClassName('error-message')[0].innerHTML = errorMessage;
    }

    if(!this.state.username) {
      document.getElementsByClassName('error-message')[0].innerHTML = 'Bitte geben Sie einen Benutzernamen an.';
    } else {
      signUp(this.state.email, this.state.password, onSignedUp, onError);
    }
  }

  handleRadioChange = event => {
    const { name, value} = event.target
    this.setState( prevState => ({
      safed: false,
      userValues: {
        ...prevState.userValues,
        [name]: value,
     }
    }), () => console.log(this.state));
  }

  createUserProfile() {
    console.log(this.state.userValues.user);
    db.collection("users").doc(this.state.userValues.user).set(this.state.userValues);
  }

  render() {
    return (
      <Layout>
        <nav className="plakat">
          <div className="container">
            <Link to="./">zurück</Link>
            <span className="site-title">Erstellen Sie einen Login</span>
          </div>
        </nav>
        <div className="container signup">
          <div className="form">
            <p>Bieten Sie Hilfe an, oder suchen Sie Hilfe?</p>
            <StatusSelector change={this.handleRadioChange} userValues={this.state.userValues} />

            <div className="fields">
              <label htmlFor='email'>Benutzername <span>(frei wählbar, kann später geändert werden)</span></label>
              <input type="text" name="username" id="username" onChange={this.handleUsername}></input>
              <label htmlFor='email'>E-Mail-Adresse</label>
              <input type="text" name="email" id="email" onChange={this.handleEmail}></input>
              <label htmlFor='password'>Passwort</label>
              <input type="text" name="password" id="password" onChange={this.handlePassword}></input>
            </div>
            <p className="error-message"></p>
            <button onClick={this.handleSignUp}>Registrieren</button>
          </div>
        </div>
      </Layout>  
    )
  }
}

export default Signin; 