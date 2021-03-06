import React, { Component, createRef } from 'react';
import Layout from '../components/Layout';
import { Link } from "react-router-dom";
import { storageRef, db, auth } from "../firebase";
import GoogleMapsLoader from 'google-maps';
import StatusSelector from '../components/StatusSelector.js';
import PublishSelector from '../components/PublishSelector.js';
import CategorySelector from '../components/CategorySelector.js';
import GoogleMapsWithInput from '../components/GoogleMapsWithInput';
import getInputFields from '../functions/getInputFields.js';
import loadImage from 'blueimp-load-image';
import '../Stylesheets/pages/profile.scss';
import avatar from '../images/avatar.svg';
import style from '../functions/googleMapStyles.js';
import "react-datepicker/dist/react-datepicker.css";


class Profile extends Component {
  state = {
    isReadyToLoop: false,
    isUploadingFile: false,
    safed: true,
  }

  inputRef = createRef();
  imageUplaodWaitMessageRef = createRef();

  static contextTypes = {
    router: () => null, // replace with PropTypes.object if you use them
  }

  componentWillMount() {
    if(localStorage.getItem('user')) {
      this.setState({
        isSignedIn: true,
        user: localStorage.getItem('user'),
      }, () => {
        db.collection("users").doc(this.state.user)
        .onSnapshot(this.handleOnNext, this.handleOnError);
      });
    }
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
    )
  }

  handleTextChange = event => {
    const { id, value } = event.target

    this.setState( prevState => ({
        safed: false,
        userValues: {
          ...prevState.userValues,
          [id]: value
        }
      })
    );
  }

  handleRadioChange = event => {
    const { name, value} = event.target
    this.setState( prevState => ({
        safed: false,
        userValues: {
          ...prevState.userValues,
          [name]: value,
        }
      })
    );
  }

  handleCheckboxChange = event => {
    const { id, checked } = event.target
    this.setState( prevState => ({
        safed: false,
        userValues: {
          ...prevState.userValues,
          [id]: checked
        }
      })
    );
  }

  handlePublishChange = event => {
    const { value } = event.target

    let isPublic = false; 
    if(value === 'published') {
      isPublic = true; 
    }

    this.setState( prevState => ({
        safed: false,
        userValues: {
          ...prevState.userValues,
          public: isPublic,
        }
      })
    );
  }

  handleCatCheckboxChange = event => { 
    const { id, checked } = event.target
    const label = event.target.dataset.label
    this.setState( prevState => ({
        safed: false,
        userValues: {
          ...prevState.userValues,
          categories: {
            ...prevState.userValues.categories,
            [id]: {
              label: label,
              checked: checked
            }
          }
        }
      })
    );
  }

  handleSubmit = event => {  
    if(event) {
      event.preventDefault();  
    }

    let now = new Date(); 
    
    this.setState( prevState => ({
        safed: true,
        userValues: {
          ...prevState.userValues,
          updated: now
        }
      }), () => {
        db.collection("users").doc(this.state.user).set(this.state.userValues);
      }
    );
  }

  uploadFile = event => {
    const input = event.target;
    var file = input.files[0];

    let uploadImage = (resizedImage) => {
      var date = new Date();
      var time = date.getTime();
      var imageRef = storageRef.child(`${time}_${file.name}`);
      let filenameThumb = 'thumb_' + time + '_' + file.name;
    
      this.setState(prevState => ({
          userValues: {
            ...prevState.userValues,
            'profilePic': filenameThumb
          },
          isUploadingFile: true,
        }), () => {
          // put file to server');
          imageRef.put(resizedImage).then((snapshot) => {
            // Uploaded a blob or file
            this.handleSubmit(); 
            setTimeout(() => {
              this.saveProfilePicUrl(filenameThumb);
            }, 8000); 
        });
      })  
    }

    loadImage(
      file,
      function (img) {
        let imgBlob = img.toBlob(function(blob) {
          console.log(blob);
          uploadImage(blob)
        });
      },
      {
        maxWidth: 600,
        orientation: true 
      } 
    );
  }

  saveProfilePicUrl(filenameThumb) {
    storageRef.child(filenameThumb).getDownloadURL().then(url => {
      this.setState(prevState => ({
        userValues: {
          ...prevState.userValues,
          'profilePicUrl': url,
        },
        isUploadingFile: false
        }), () => {
          this.handleSubmit(); 
        } 
      )
    });
  }

  saveLocation = (location) => {
    this.setState(prevState => ({
      safed: false,
      userValues: {
        ...prevState.userValues,
        'location': location
        }
      })
    )
  }

  getProfilePicUrl = () => {
    storageRef.child(`${this.state.userValues.profilePic}`).getDownloadURL().then(url => {
      this.setState(prevState => ({
        ...prevState,
        'profilePicUrl': url
        }) 
      )
    });
  }

  getCatsAsList = (userCats) => {
    let catsAsList = {}; 
    
    Object.keys(userCats).forEach((key, index) => {
      catsAsList[key] = userCats[key].checked;
    })

    return catsAsList;
  }

  deleteUserData = () => {
    // asking for confirmation
    let response = window.confirm("Wollen Sie wirklich Ihr Konto und Ihre Profilseite löschen?");

    if(response) {
      // yes delete
      db.collection("users").doc(this.state.userValues.user).delete().then(() => {
        var user = auth.currentUser;
        
        user.delete().then(() => {
          this.props.history.push(`/?deleted=true`)
        }).catch(function(error) {
          console.log("Error removing user: ", error);
        });
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
    }
  }

  render() {
    const { isSignedIn, isReadyToLoop } = this.state;

    let fields = [
        {
          type: 'text',
          name: 'username',
          change: this.handleTextChange,
          label: 'Benutzername'
        },
        {
          type: 'textarea',
          name: 'description',
          change: this.handleTextChange,
          label: 'Beschreiben Sie Ihr Angebot'
        },
        {
          type: 'text',
          name: 'email',
          change: null,
          label: 'E-Mail',
          disabled: true
        },
        {
          type: 'text',
          name: 'spezialDescr',
          change: this.handleTextChange,
          label: 'Mein Spezial-Skill'
        },
      ]

    return (
          <Layout>
            { isSignedIn ? (
              <>
              <nav className={isReadyToLoop ? this.state.userValues.status : undefined }> 
                <div className="container">
                  {
                    this.props.location.state !== 'signup' &&
                    <a onClick={ this.context.router.history.goBack }>zurück</a>
                  }
                  
                  <span className="site-title">Mein Profil bearbeiten</span>
                  { isReadyToLoop &&
                    <Link className="link-right" to={`/user/${this.state.userValues.user}`}>Profil ansehen</Link>
                  }
                </div>
              </nav>
              <div className="container">
                <form onSubmit={this.handleSubmit}>
                  <section className="status">
                    {
                      this.props.location.state == 'signup' &&
                      <p className="title" style={{lineHeight: '1.3em', fontSize: '1.5em'}}>
                        <i>Willkommen bei Oreka! Bitte füllen Sie ihr Profil möglichst vollständig aus.</i>
                      </p>
                    }
                    <p className="title">Mein Status:</p>
                    { isReadyToLoop && 
                    <div className="options">
                      <StatusSelector change={this.handleRadioChange} searchingFor={this.state.userValues.status} userValues={this.state.userValues} />
                      <PublishSelector change={this.handlePublishChange} userValues={this.state.userValues} />
                      <button 
                          className={(isReadyToLoop && this.state.userValues.status) + " " + (isReadyToLoop && this.state.safed ? 'saved' : 'not-saved') }>
                            { (isReadyToLoop && this.state.safed ? 'Gespeichert' : 'Speichern') }
                      </button>
                    </div>
                    }
                  </section>
                  <section>                    
                    <p className="title">Angaben zu mir: </p>
                    <div className="profile-top">
                      <div className="profile left">
                        <div className={"image-cropper " + (isReadyToLoop && this.state.userValues.status) } >
                          { isReadyToLoop ?
                          <img 
                            alt=" " 
                            id="myimg" 
                            src={this.state.userValues.profilePicUrl ?  this.state.userValues.profilePicUrl : avatar } 
                          />
                            : '' }
                        </div>
                        <input type="file" id="selectedFile" ref={input => this.inputRef = input} onChange={ this.uploadFile } style={{display: 'none'}} />
                        <input type="button" value={this.state.profilePic !== '' ? 'Bild ändern' : 'Bild hochladen'} onClick={() => this.inputRef.click()} />
                        <p className="upload-message" isloading={this.state.isUploadingFile ? 'true':''}>{ this.state.isUploadingFile ? 'Bitte warten Sie einen Moment, bis das Bild verarbeitet wurde' : '' }</p>
                      </div>
                      <div className="profile right">
                        {                    
                          fields.map((field, index) => 
                            <div key={index}>
                              <label htmlFor={field.name}>{field.label}</label>
                              { isReadyToLoop && getInputFields(field, this.state) }
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </section>
                  <section className="category-selection">
                    <p className="title">Bereiche, in denen ich Hilfe {isReadyToLoop && this.state.userValues.status === 'suche' ? 'suche' : 'anbiete' }:</p>
                    {
                      isReadyToLoop &&   
                      <CategorySelector 
                        userValues={this.state.userValues} 
                        categories={this.getCatsAsList(this.state.userValues.categories)} 
                        change={this.handleCatCheckboxChange} />
                    }

                  </section>
                  <section>
                    <p className="title">Mein Wohnort</p>
                    <div className="map">
                    { isReadyToLoop && 
                      <GoogleMapsWithInput 
                        location={this.state.userValues.location}
                        saveLocation={this.saveLocation}
                      />
                    }
                    </div>
                  </section>
                  <section className="verwaltung">
                    <p className="title">Verwaltung</p>
                    <p 
                      onClick={this.deleteUserData} 
                      className={ isReadyToLoop ? this.state.userValues.status + " action" : undefined}
                    >
                      Alle meine Daten löschen
                    </p>
                  </section>
                  <section className="save">
                    <p className="title">Speichern:</p>
                    <div>
                      <button 
                          className={(isReadyToLoop && this.state.userValues.status) + " " + (isReadyToLoop && this.state.safed ? 'saved' : 'not-saved') }>
                            { (isReadyToLoop && this.state.safed ? 'Gespeichert' : 'Speichern') }
                      </button>
                    </div>
                  </section>
                </form>
              </div>
              </>
            ) : 
            (
              <div className="container">
                <p>Sie müssen eingeloggt sein, um Ihr Profil ansehen zu können.</p>
              </div>
            )
          }
        </Layout>  
    )
  }
}

export default Profile; 
