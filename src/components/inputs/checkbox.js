import React, { Component } from 'react';

class Checkbox extends Component {

  render() {
    let { field, checked } = this.props;

    return (
      <input 
        id={field.name} 
        name={field.name} 
        type={field.type} 
        onChange={field.change}
        checked={ checked || false } 
      />
    );
  }
}

export default Checkbox;
