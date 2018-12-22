import React, { Component } from 'react';
import './categoryselector-style.scss';


class CategorySelector extends Component {

  render() {
    let categories = [
      {
        name: 'haushalt',
        label: 'Haushalt'
      },
      {
        name: 'garten',
        label: 'Garten'
      },
      {
        name: 'einkaufen',
        label: 'Einkaufen'
      },
      {
        name: 'finanzen',
        label: 'Finanzen'
      },
      {
        name: 'behoerden',
        label: 'Behörden'
      },
      {
        name: 'computer',
        label: 'Computer'
      },
      {
        name: 'transport',
        label: 'Transport'
      },
      {
        name: 'spezial',
        label: 'Spezial'
      },
    ]

    return (
      <div class="category-selector">
        <div className="category-bar">
        {                    
          categories.map((field, index) => 
            <div key={index} name={field.name}>
              <input 
              id={field.name} 
              name={field.name} 
              type='checkbox'
              data-label={field.label}
              onChange={this.props.change}
              checked={
                // IF IT IS CALLED FROM PROFILE
                this.props.userValues ?
                ( Object.keys(this.props.userValues.categories).length > 0 && this.props.userValues.categories[field.name] ?
                this.props.userValues.categories[field.name].checked : false ) :
                // OR CALLED FROM HOME WEHERE THERE ARE NO USER VALUES
                ( Object.keys(this.props.searchCat).length > 0 && this.props.searchCat[field.name] ? this.props.searchCat[field.name].checked : false )
              } 
              />
              <label htmlFor={field.name} className={this.props.userValues ? this.props.userValues.status : this.props.searchingFor}>
                <div className={field.name + ' logo'}></div>
              </label>
            </div>
          )
        }
        </div>
        <div className="label-bar">
        {                    
          categories.map((field, index) => 
            <p>
            <span key={index}>{ field.label }</span>
            { (field.name === 'spezial') && this.props.userValues ? 
              <span>
                { this.props.userValues.spezialDescr !== '' ?
                '(' + this.props.userValues.spezialDescr + ')' : ''
                }</span>
              : '' }
            </p>
          )
        }
        </div>
      </div>
    )
  }
}

export default CategorySelector; 