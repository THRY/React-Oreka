import React, { Component } from 'react';
import { Link } from "react-router-dom"; 
import { storageRef, db } from "../firebase";

class ListItem extends Component {

  state = {
    profilePicUrl: '',
    catList: []
  }

  componentWillMount() {
    if(this.props.user.profilePic) {
      this.getProfilePicUrl(this.props.user.profilePic);
    }
    if(Object.keys(this.props.user.categories).length > 0) {
      this.createCatList();
    }
  }

  render() {
    return (
    <Link to={`/user/${this.props.user.user}`}>
      <div className="list-item">
        <div className="img-cropper">
          <img alt="Profile" src={ this.state.profilePicUrl } />
        </div>
        <div className="infos">
          <p className="name">{ this.props.user.username }</p>
          <p className="description">{ this.props.user.description }</p>
          <p className="categories">
            {
              Object.keys(this.state.catList).map(key => 
                <span>{ /*this.props.user.categories[key].label */}</span>  
              )
            }
          </p>
        </div>
      </div>
    </Link>
    )
  }

  createCatList = () => {
    let filtered = Object.keys(this.props.user.categories).filter(key => {
      return this.props.user.categories[key].checked === true;
    })

    this.setState(prevState => ({
      catList: filtered
      })
    )
  }

  getProfilePicUrl = (filename) => {
    storageRef.child(filename).getDownloadURL().then(url => {
      console.log(url); 
      this.setState(prevState => ({
          profilePicUrl: url
        }) 
      )
    });
  }
}

export default ListItem;