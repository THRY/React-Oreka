import React, { Component } from 'react';
import '../Stylesheets/components/CategorySelector-style.scss';


class CategoryDisplay extends Component {

  state = {
    catList: []
  }

  componentWillMount() {
    this.createCatList();
  }

  hasBorderBottom(listLenght, currentIndex) {
    let style = {};

    if(window.innerWidth < 576) {
      // liste gerade zahl, dann bei allen kleiner als die beiden zweitletzten elemente eine border hinzufügen
      if(listLenght % 2 == 0 && currentIndex < listLenght-2) {
        style = {borderBottom: '1px solid black'}
      // liste ungerade zahl, dann bei allen kleiner als das letzte element eine border hinzufügen
      } else if(listLenght % 2 != 0 && currentIndex < listLenght-1) {
        style = {borderBottom: '1px solid black'}
      } else {
        style = {borderBottom: '0px'};
      }
    }
    
    return style;
  }

  hasBorderRadius(listLenght, currentIndex) {
    let style = {};
    
    if(window.innerWidth < 576) {
      // zweitletztes element
      if((currentIndex > 1 || listLenght <= 2) && currentIndex == listLenght-2) {
        // links
        if(currentIndex % 2 == 0) {
          style = {borderBottomLeftRadius: '5px'};
        }
      // letztes element
      } else if((currentIndex > 1 || listLenght <= 2) && currentIndex == listLenght-1) {
        // links
        if(currentIndex % 2 == 0) {
          style = {borderBottomLeftRadius: '5px'};
        // rechts
        } else {
          style = {borderBottomRightRadius: '5px'};
        }
      }
    }

    return style;
  }

 

  hasBorderRight(listLenght, currentIndex) {
    let style = {};
    
    if(window.innerWidth < 576) {
      if(currentIndex == listLenght-1 && currentIndex % 2 == 0) {
        style = {boxSizing: 'content-box', borderRight: '1px solid black'};
      } else {
        style = {borderRight: '0px'};
      }
    } 
    return style;
  }

  render() {
    return (
      <div className="category-display">
      <div 
        className="category-bar" 
        style={ {width: this.state.catList.length * 12.5 + "%" } }>
        {                    
          this.state.catList.map((field, index) => 
            <div 
              key={index} name={field.name}
              name={field.name}
              style={ 
                Object.assign(
                  this.hasBorderBottom(this.state.catList.length, index), 
                  this.hasBorderRight(this.state.catList.length, index),
                  this.hasBorderRadius(this.state.catList.length, index)
                )
              }
              >
              <input 
              id={field.name} 
              name={field.name} 
              type='checkbox'
              onChange={this.props.change}
              defaultChecked
              />
              <label 
                htmlFor={field.name} 
                data-label={field.label}
                className={this.props.userValues ? this.props.userValues.status : this.props.searchingFor}
                >
                <div className={field.name + ' logo'}></div>
              </label>
            </div>
          )
        }
        </div>
        <div className="label-bar">
        {                    
           this.state.catList.map((field, index) => 
            <p key={index}>
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