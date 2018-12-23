import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Link } from "react-router-dom";
import { storageRef, db } from "../firebase";
import GoogleMapsLoader from 'google-maps';
import { radios } from '../functions/fields.js';
import StatusSelector from '../components/StatusSelector.js';
import CategorySelector from '../components/CategorySelector.js';
import getInputFields from '../functions/getInputFields.js';



class User extends Component {
  state = {
    isReadyToLoop: false,
    userId: ''
  }

  componentWillMount() {
    this.setState({
      userId: this.props.match.params.value,
    }, () => {
      db.collection("users").doc(this.state.userId)
      .onSnapshot(this.handleOnNext, this.handleOnError);
    });
  }

  handleOnNext = (doc) =>  {
    const data = doc.data();

    this.setState( prevState => ({
      isReadyToLoop: true,
      userValues: {
        ...prevState.userValues,
        ...data
      }
    }), () => {
      console.log(this.state);
      //this.loadMap();
      if(this.state.userValues.profilePic) {
        this.getProfilePicUrl();
      }
    });
  }

  getProfilePicUrl = () => {
    storageRef.child(`${this.state.userValues.profilePic}`).getDownloadURL().then(url => {
      console.log(url); 
      this.setState(prevState => ({
        ...prevState,
        'profilePicUrl': url
        }) 
      )
    });
  }

  render() {
    const { isSignedIn, isReadyToLoop } = this.state

    return (
      <Layout>
          { this.state.isReadyToLoop &&
          <>
          <nav className={isReadyToLoop && this.state.userValues.status}>
            <div className="container">
              <Link to="/">zurück</Link>
              <span className="site-title">Profil von {this.state.userValues.username}</span>
            </div>
          </nav>
          <div className="container">
            <div class="image-cropper">
              <img src={this.state.profilePicUrl} />
            </div>
          </div> 
          </>
          }
      </Layout>  
    )
  }
}

export default User; 
