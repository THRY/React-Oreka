import React, { Component } from 'react';
import { auth, signUp, signOut, logIn } from "../firebase";


class Authentication extends Component {
  componentDidMount() {
    this.unregisterAuthObserver = auth.onAuthStateChanged(user => {
      if (user) {
        console.log("is logged in")
        this.setState({
          isSignedIn: true,
          loading: false
        });
      } else {
        console.log("not logged in");
        this.setState({
          isSignedIn: false,
          loading: false
        });
      }
    });
  }

  render() {
    return (
      <></>
    );
  }
}

export default Authentication;
