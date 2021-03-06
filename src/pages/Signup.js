import React, { Component } from 'react';
import Layout from '../components/Layout';
import { auth, signUp, db} from "../firebase";
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
      location: "",
      updated: ""
    }
  };  

  static contextTypes = {
    router: () => null, // replace with PropTypes.object if you use them
  }


  handlePassword = (e) => {
    let name = e.target.name;

    this.setState ({
      [name]: e.target.value
    })
  }

  handleEmail = (e) => {
    const email = e.target.value;

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

    this.setState(prevState => ({
        username: username,
        userValues: {
          ...prevState.userValues,
          username: username
        }
      })
    )
  }   

  handleSignUp = (e) => {
    e.preventDefault(); 

    const onSignedUp = () => {
      const userId = auth.currentUser.uid;

      localStorage.setItem('user', userId);
      let now = new Date();

      this.setState(prevState => ({
        userValues: {
          ...prevState.userValues,
          user: userId,
          updated: now
        }
      }), () => {
        this.createUserProfile();
        this.props.history.push(
          {
            pathname: `/profile/${userId}`,
            state: 'signup'
          }
        )
      })
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
        default: 
      }
      document.getElementsByClassName('error-message')[0].innerHTML = errorMessage;
    }

    if(!this.state.username) {
      document.getElementsByClassName('error-message')[0].innerHTML = 'Bitte geben Sie einen Benutzernamen an.';
    } else if(this.state.password !== this.state.passwordrepeat) {
      document.getElementsByClassName('error-message')[0].innerHTML = 'Die eingegebenen Passöwrter stimmen nicht überein.';
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
      })
    );
  }

  createUserProfile() {
    db.collection("users").doc(this.state.userValues.user).set(this.state.userValues);
  }

  render() {
    return (
      <Layout>
        <nav className="neutral">
          <div className="container">
            <a onClick={ this.context.router.history.goBack }>zurück</a>
            <span className="site-title">Erstellen Sie einen Login</span>
          </div>
        </nav>
        <div className="container signup">
          <form onSubmit={this.handleSignUp}>
            <p>Bieten Sie Hilfe an, oder suchen Sie Hilfe?</p>
            <StatusSelector change={this.handleRadioChange} userValues={this.state.userValues} />

            <div className="fields">
              <label htmlFor='email'>Benutzername <span>(frei wählbar, kann später geändert werden)</span></label>
              <input type="text" name="username" id="username" onChange={this.handleUsername}></input>
              <label htmlFor='email'>E-Mail-Adresse</label>
              <input type="email" name="email" id="email" onChange={this.handleEmail}></input>
              <label htmlFor='password'>Passwort</label>
              <input type="password" name="password" id="password" onChange={this.handlePassword}></input>
              <label htmlFor='password-repeat'>Passwort wiederholen</label>
              <input type="password" name="passwordrepeat" id="password-repeat" onChange={this.handlePassword}></input>
            </div>
            <p className="error-message"></p>
            <button type="submit">Registrieren</button>
          </form>
        </div>
      </Layout>  
    )
  }
}

export default Signin; 