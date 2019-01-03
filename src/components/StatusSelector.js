import React, { Component } from 'react';
import styles from '../Stylesheets/components/StatusSelector-style.scss';


class StatusSelector extends Component {

  render() {
    let status = '';

    if(this.props.userValues) {
      status = this.props.userValues.status;
    } else if(this.props.searchingFor) {
      status = this.props.searchingFor;
    }

    return (
      <div className="status-selector">
        <input 
          id="status1" 
          name="status"
          type="radio"
          value='suche' 
          onChange={this.props.change} 
          checked={ status === 'suche' ? true : false }
        />
        <label htmlFor="status1" className={ status }>
        <p>suche</p>  
        </label>

         <input 
          id="status2" 
          name="status"
          type="radio"
          value='biete'
          onChange={this.props.change} 
          checked={ status === 'biete' ? true : false  }
        />
        <label htmlFor="status2" className={ status }>
        <p>biete</p>  
        </label>
        <p className="label">Nachbarn, die Hilfe {this.props.searchingFor}n</p>
      </div>
    )
  }
}

export default StatusSelector; 