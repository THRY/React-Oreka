import React, { Component } from 'react';
import { Link } from "react-router-dom"; 
import { signOut } from "../firebase";
import '../Stylesheets/components/Header-style.scss';


class Header extends Component {
  
  handleSignOut = () => {
    const goToHome = () => {
      window.location.href = '/';
    }
    signOut(goToHome);
  }

  toggleMenuButton() {
    console.log('toggle');
    var mobileMenu = document.querySelector('.mobile-header') // Using a class instead, see note below.
    mobileMenu.classList.toggle('open');

    var mobileToggle = document.querySelector('.mobile-toggle') // Using a class instead, see note below.
    mobileToggle.classList.toggle('open');
  }
  
  render() {
    const { isSignedIn } = this.props;

    return (
      <header>
        <div 
          className="mobile-toggle"
          onClick={this.toggleMenuButton}
        >
        </div>

        <div className="box left">
          { isSignedIn ?
            <span>{ this.props.user.email } </span>
            : <></>
          }
        </div>

        <div className="banner">
          <Link to="/">
            <img className="logo" src="/assets/logo.svg"></img>
          </Link>
        </div>
         

        <div className="box right">

          { isSignedIn ?
            <>
            <Link to={`/profile/${this.props.user.uid}`}>Mein Profil</Link>
            <Link to="/messages">Meine Nachrichten</Link></> 
            : <></>
          }
          
          { isSignedIn ?
              <a onClick={this.handleSignOut}>Abmelden</a>
            :
            <>
            <Link to="/signup">Registrieren</Link>
            <Link to="/login">Anmelden</Link>
            </>
          }
        </div>

        <div className="mobile-header">
          
            { isSignedIn ?
              <ul>
              <li><Link to={`/profile/${this.props.user.uid}`}>Mein Profil</Link></li>
              <li><Link to="/messages">Meine Nachrichten</Link></li>
              </ul>
              : ''
            }
          
            { isSignedIn ?
              <ul>
              <li><i>Angemeldet als:</i></li>
              <li>{ this.props.user.email }</li>
              <li><a onClick={this.handleSignOut}>Abmelden</a></li>
              </ul>
              :
              <ul>
              <li><Link to="/signup">Registrieren</Link></li>
              <li><Link to="/login">Anmelden</Link></li>
              </ul>
            }
        </div>
      </header>
    )
  }
}

export default Header;