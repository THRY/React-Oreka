import React, { Component } from 'react';
import { Link } from "react-router-dom"; 
import { storageRef, db } from "../firebase";
import styles from '../Stylesheets/components/ListItem-style.scss';

class ListItem extends Component {

  state = {
    profilePicUrl: '',
    catList: []
  }

  componentWillMount() {
    if(Object.keys(this.props.user.categories).length > 0) {
      this.createCatList();
    }
  }

  handleMouseEnter(event) {
    console.log('mouse enter');
    let id = event.target.id.split('-')[1];
    let pin = document.getElementById('pin-' + id);
    //pin.classList.add("hovered");
  }

  handleMouseOut(event) {
    let id = event.target.id.split('-')[1];
    let pin = document.getElementById('pin-' + id);
    //pin.classList.remove("hovered");
  }

  render() {
    return (
      <Link to={`/user/${this.props.user.user}`}>
        <div 
          className={ "list-item " + this.props.user.status } id={'listitem-' + this.props.user.user} 
          onMouseEnter={this.handleMouseEnter} 
          onMouseLeave={this.handleMouseOut}
        >
          <div className="column left">
            <div className="img-cropper">
              <img 
                alt={this.props.user.username}
                src={ this.props.user.profilePicUrl } 
                style={ (!this.props.user.profilePicUrl) ? {display: 'none'}: {} }
              />
            </div>
          </div>
          <div className="column right">
            <div className="infos">
              <p className="name">{ this.props.user.username }</p>
              <p className="description">{ this.props.user.description }</p>
              <p className="categories">
                {
                  Object.keys(this.state.catList).map((key, index) =>                     
                    <span key={index} className={ this.state.catList[key] }></span>
                  )
                }
                <span className="link-to-profile">zum Profil</span>
              </p>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  createCatList = () => {
    let filtered = Object.keys(this.props.user.categories).filter(key => {
      return this.props.user.categories[key].checked === true;
    });

    console.log(filtered);

    this.setState(prevState => ({
      catList: filtered
      })
    )
  }
}

export default ListItem;