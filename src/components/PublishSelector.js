import React, { Component } from 'react';
import '../Stylesheets/components/StatusSelector-style.scss';


class PublishSelector extends Component {

  render() {
    return (
      <div className="status-selector">
        <input 
          id="publish1" 
          name="published"
          type="radio"
          value='draft' 
          onChange={ this.props.change } 
          checked={ this.props.userValues.public ? false : true }
        />
        <label htmlFor="publish1" className={ this.props.userValues.status }>
        <p>Entwurf</p>  
        </label>

         <input 
          id="publish2" 
          name="published"
          type="radio"
          value='published'
          onChange={ this.props.change } 
          checked={ this.props.userValues.public ? true : false }
        />
        <label htmlFor="publish2" className={ this.props.userValues.status }>
        <p>Publizert</p>  
        </label>
        <p className="label">Ihr Profil ist { this.props.userValues.public ? 'publiziert' : 'nicht veröffentlicht'}</p>
      </div>
    )
  }
}

export default PublishSelector; 