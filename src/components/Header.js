import React, { Component } from 'react';
import { Link } from "react-router-dom"; 
import { signOut } from "../firebase";


class Header extends Component {
  
  handleSignOut = () => {
    const goToHome = () => {
      window.location.href = '/';
    }
    signOut(goToHome);
  }

  render() {
    return (
      <header>
         <div className="box left">
         { this.props.isSignedIn ?
            <span>{ this.props.user.email } </span>
            : ''
         }
         </div>

        <Link to="/">
          <img className="logo" src="/assets/logo.svg"></img>
        </Link>
         

        <div className="box right">

          { this.props.isSignedIn ?
            <>
            <Link to={`/profile/${this.props.user.uid}`}>Mein Profil</Link>
            <Link to="/messages">Meine Nachrichten</Link></> 
            : ''
          }
          
          { this.props.isSignedIn ?
              <a onClick={this.handleSignOut}>Abmelden</a>
            :
            <Link to="/login">Anmelden</Link>
          }
        </div>
        
      </header>
    )
  }
}

export default Header;