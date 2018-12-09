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
        localStorage.setItem('user', user.uid);
        console.log(localStorage.getItem('user'));
      } else {
        console.log("not logged in");
        this.setState({
          isSignedIn: false,
          loading: false
        });
        localStorage.removeItem('user');
        console.log(localStorage.getItem('user'));
      }
    });
  }

  render() {
    const { isSignedIn, user } = this.state

    /*
    let childrenWithProps = React.Children.map( this.props.children, function(child) {
      if (React.isValidElement(child)){
          return React.cloneElement(child, props);
      }
        return child;
    });
    */


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