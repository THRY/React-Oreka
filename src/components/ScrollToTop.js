import React, { Component } from 'react';
import { withRouter } from "react-router";

class ScrollToTop extends Component {

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      console.log('scroll to top');
      window.scrollTo(0, 0);
    }
  }
  
  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop);