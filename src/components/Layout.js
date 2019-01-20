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
      if(user) {
        this.setState({
          isSignedIn: true,
          loading: false,
          user: user
        });
        localStorage.setItem('user', user.uid);
      } else {
        this.setState({
          isSignedIn: false,
          loading: false
        });
        localStorage.removeItem('user');
      }
    });
  }

  render() {
    const { isSignedIn, user } = this.state
    
    return (
      <>
        <Header user={user} isSignedIn={isSignedIn}/>
        <main> { this.props.children }</main>
        <Footer />
      </>
    )
  }
}

export default Layout;