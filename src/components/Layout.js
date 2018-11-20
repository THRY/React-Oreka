import React, { Component } from 'react';
import { auth } from "../firebase";
import Header from './Header'
import Footer from './Footer'

class Layout extends Component {
  state = {
    isSignedIn: false,
  };  

  componentDidMount() {
    this.unregisterAuthObserver = auth.onAuthStateChanged(user => {
      if (user) {
        console.log(user)
        this.setState({
          isSignedIn: true,
          loading: false,
          user: user
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
      <>
        <Header user={this.state.user} isSignedIn={this.state.isSignedIn} />
        <main>{ this.props.children }</main>
        <Footer />
      </>
    )
  }
}

export default Layout;