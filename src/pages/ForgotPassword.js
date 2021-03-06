import React, { Component } from 'react';
import Layout from '../components/Layout';
import { auth } from "../firebase";
  

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
    this.setState ({
      email: e.target.value
    })
  }   

  handleResetPassword = () => {
    auth.sendPasswordResetEmail(this.state.email).then(function() {
      // Email sent
    }).catch((error) => {
      //this.props.history.push('/login');
      this.refs.errorRef.innerHTML = 'Eine Mail zum Zurücksetzen des Passwortes wurde an die oben angegebene Adresse geschickt.';
    });    
  }

  render() {
    return (
      <Layout>
         <nav className="neutral">
          <div className="container">
            <a onClick={ this.context.router.history.goBack }>zurück</a>
            <span className="site-title">Fordern Sie ein neues Passwort an</span>
          </div>
        </nav>
        <div className="container login">
        <form onSubmit={this.handleResetPassword}>
            <div className="fields">
              <label htmlFor='email'>E-Mail-Adresse</label>
              <input type="text" name="email" id="email" onChange={this.handleEmail}></input>
            </div>
            <p className="error-message" ref="errorRef"></p>
            <button type="submit">Senden</button>
          </form>         
        </div>
      </Layout>  
    )
  }
}

export default ForgotPassword; 