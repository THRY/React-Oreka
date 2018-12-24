import React, { Component } from 'react';
import styles from '../Stylesheets/components/CategorySelector-style.scss';


class CategoryDisplay extends Component {

  state = {
    catList: []
  }

  componentWillMount() {
    this.createCatList();
  }

  render() {
    return (
      <div class="category-selector">
      <div className="category-bar" style={ {width: this.state.catList.length * 12.5 + "%" } }>
        {                    
          this.state.catList.map((field, index) => 
            <div key={index} name={field.name}>
              <input 
              id={field.name} 
              name={field.name} 
              type='checkbox'
              data-label={field.label}
              onChange={this.props.change}
              checked={ true }
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
           this.state.catList.map((field, index) => 
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

  createCatList = () => {

    console.log(this.props.userValues); 
    
    let filtered = Object.keys(this.props.userValues.categories).filter(key => {
      return this.props.userValues.categories[key].checked === true;
    });

    let categories = []; 

    filtered.forEach((key, index) => {
      let entry = {
        name: key,
        label: this.props.userValues.categories[key].label
      };
      categories.push(entry);
    });

    this.setState(prevState => ({
      catList: categories
      })
    )
  }
}

export default CategoryDisplay; 