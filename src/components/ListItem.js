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
        <div className={ "list-item " + this.props.user.status }>
          <div className="column left">
            <div className="img-cropper">
              <img src={ this.state.profilePicUrl } />
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

  getProfilePicUrl = (filename) => {
    console.log('GET PROFILE PIC FOR ' + this.props.user.username);
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