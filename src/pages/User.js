import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Link } from "react-router-dom";
import { db } from "../firebase";
import GoogleMapsLoader from 'google-maps';
import CategoryDisplay from '../components/CategoryDisplay.js';
import GoogleMaps from '../components/GoogleMaps.js';
import '../Stylesheets/pages/user.scss';
import avatar from '../images/avatar.svg';




class User extends Component {
  state = {
    isReadyToLoop: false,
    userId: ''
  }

  static contextTypes = {
    router: () => null, // replace with PropTypes.object if you use them
  }

  componentWillMount() {
    let isSignedIn;

    if(localStorage.getItem('user')) {
      isSignedIn = true;
    }

    this.setState({
      userId: this.props.match.params.value,
      isSignedIn: isSignedIn
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
      })
    );
  }

  render() {
    const { isSignedIn, isReadyToLoop } = this.state

    return (
      <Layout>
          { isReadyToLoop &&
          <>
          <nav className={isReadyToLoop && this.state.userValues.status}>
            <div className="container">
              <a onClick={ this.context.router.history.goBack }>zurück</a>
              <span className="site-title">Profil von {this.state.userValues.username}</span>
            </div>
          </nav>
          <div className="container user">
            { this.state.userValues.public ?
              <>
              <section className="top">
                <div className="left">
                  <div className="image-cropper">
                    <img 
                      alt={this.state.userValues.profilePicUrl}
                      src={ this.state.userValues.profilePicUrl ? this.state.userValues.profilePicUrl : avatar } 
                    />
                    
                  </div>
                </div>

                <div className="right">
                  <div className="infos">
                    <h1>{this.state.userValues.username}</h1>
                    { this.state.userValues.description !== '' &&
                      <h2 className="caption">«{this.state.userValues.description}»</h2>
                    }
                    <Link 
                      className={"message " + this.state.userValues.status + ' ' + ((this.state.isSignedIn && this.state.userValues.user !== localStorage.getItem('user')) ? '' : 'disabled') } 
                      to={`/messages?to=${this.state.userValues.user}`}
                    >Nachricht senden</Link>
                    { !this.state.isSignedIn &&
                      <p className="hint">Sie müssen angemeldet sein, um einem Benutzer eine Nachricht senden zu können.</p>
                    }
                  </div>
                </div>
              </section>
              <section className="categories">
              <p className="title">In diesen Bereichen {this.state.userValues.status } ich Hilfe{this.state.userValues.status == 'biete' ? ' an' : ''}:</p>
              { isReadyToLoop &&
                <CategoryDisplay userValues={this.state.userValues}/>
              }
                
              </section>
              <section className="map">
                <p className="title">Hier wohnt {this.state.userValues.username}:</p>
                <GoogleMaps 
                  onPinHover={ null } 
                  filterResult={ [this.state.userValues] } 
                  updatedAt={ 0 }
                />
              </section>
              </>
              :
              <p>Dieses Profil ist nicht öffentlich</p>
            } 
          </div> 
          </>
          }
      </Layout>  
    )
  }
}

export default User; 
