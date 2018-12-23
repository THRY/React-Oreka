import React, { Component } from 'react';
import Layout from './components/Layout';
import { auth, signUp, signOut, logIn, db} from "./firebase";
import { Link } from "react-router-dom";
import StatusSelector from './components/StatusSelector/StatusSelector.js'
import { radios } from './functions/fields.js';
import './Options.scss';


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
      username: "",
      user: ""
    }
  };  

  handlePassword = (e) => {
    this.setState ({
      password: e.target.value
    })
    console.log(e.target.value);
  }

  handleEmail = (e) => {
    console.log(e.target.value);
    this.setState(prevState => ({
        email: e.target.value,
        userValues: {
          ...prevState.userValues,
          email:  e.target.value
        }
      })
    )
  }   

  handleSignUp = () => {
    const onSignedUp = () => {
      const userId = auth.currentUser.uid;
      console.log(userId)
      this.setState(prevState => ({
          userValues: {
            ...prevState.userValues,
            user: userId
          }
        }), () => {
          this.createUserProfile();
          //this.props.history.push('/')
        })
    }
    signUp(this.state.email, this.state.password, onSignedUp);
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
    let statusFields = radios.map(field => {
      field.change = this.handleRadioChange;
      return field;
    })

    return (
      <Layout>
        <nav className="plakat">
          <div className="container">
            <Link to="/">zurück</Link>
            <span className="site-title">Erstellen Sie einen Login</span>
          </div>
        </nav>
        <div className="container signup">
          <p>Erstellen Sie Ihren eigenen Account:</p>
          <StatusSelector change={this.handleRadioChange} userValues={this.state.userValues} />
       
          <label htmlFor='email'>E-Mail-Adresse</label>
          <input type="text" name="email" id="email" onChange={this.handleEmail}></input>
          <label htmlFor='password'>Passwort</label>
          <input type="text" name="password" id="password" onChange={this.handlePassword}></input>
          <button onClick={this.handleSignUp}>Sign Up</button>
        </div>
      </Layout>  
    )
  }
}

export default Signin; 