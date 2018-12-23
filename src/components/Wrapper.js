import React, { Component } from 'react';

class Wrapper extends Component {
  render() {
    if(this.props.isSignedIn && this.props.secure) {
      return (     
        <> { this.props.children } </>
      )
    } else if(!this.props.secure) {
      return (
        <> { this.props.children } </>
      )
    }
  }
}

export default Wrapper;