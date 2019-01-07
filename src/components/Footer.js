import React, { Component } from 'react';
import logoWhite from '../images/logo-white.svg';
import '../Stylesheets/components/Footer-style.scss';

class Footer extends Component {
  render() {
    return (
      <footer className="App-footer">
        <div className="container">
          <img src={logoWhite}></img>
          <p>Die Schweizer Zeitvorsorge</p>
        </div>
      </footer>
    )
  }
}

export default Footer;