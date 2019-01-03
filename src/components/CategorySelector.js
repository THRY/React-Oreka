import React, { Component } from 'react';
import styles from '../Stylesheets/components/CategorySelector-style.scss';


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
            <div 
              key={index} 
              name={field.name}
            >
              <input 
              id={field.name} 
              name={field.name} 
              type='checkbox'
              data-label={field.label}
              onChange={this.props.change}
              checked={
                ( Object.keys(this.props.categories).length > 0 && this.props.categories[field.name] ?
                this.props.categories[field.name] : false ) 
              } 
              />
              <label 
                htmlFor={field.name} 
                className={this.props.userValues ? this.props.userValues.status : this.props.searchingFor}
                data-label={field.label}
              >
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