import React, { Component } from 'react';
import { auth } from "../firebase";


class Authentication extends Component {
  componentDidMount() {
    this.unregisterAuthObserver = auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          isSignedIn: true,
          loading: false
        });
      } else {
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
