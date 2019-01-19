import React, { Component, createRef } from 'react';
import Layout from '../components/Layout';
import { Link } from "react-router-dom";
import { storageRef, db, auth } from "../firebase";
import GoogleMapsLoader from 'google-maps';
import StatusSelector from '../components/StatusSelector.js';
import PublishSelector from '../components/PublishSelector.js';
import CategorySelector from '../components/CategorySelector.js';
import getInputFields from '../functions/getInputFields.js';
import '../Stylesheets/pages/profile.scss';
import avatar from '../images/avatar.svg';
import style from '../functions/googleMapStyles.js';

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
    console.log(localStorage.getItem('user'));
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
    }), () => {
      console.log(this.state);
      this.loadMap();
    });
  }

  handleTextChange = event => {
    const { id, value } = event.target

    this.setState( prevState => ({
      safed: false,
      userValues: {
        ...prevState.userValues,
        [id]: value
     }
    }), () => console.log(this.state));
  }

  handleRadioChange = event => {
    const { name, value} = event.target
    this.setState( prevState => ({
      safed: false,
      userValues: {
        ...prevState.userValues,
        [name]: value,
     }
    }), () => console.log(this.state));
  }

  handleCheckboxChange = event => {
    const { id, checked } = event.target
    this.setState( prevState => ({
      safed: false,
      userValues: {
        ...prevState.userValues,
        [id]: checked
     }
    }), () => console.log(this.state));
  }

  handlePublishChange = event => {
    const { name, value } = event.target

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
    }), () => console.log(this.state));


    console.log(name + ' ' + value);
  }

  handleCatCheckboxChange = event => { 
    const { id, checked } = event.target
    const label = event.target.dataset.label
    console.log(label);
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
    }), () => console.log(this.state));
  }

  handleSubmit = event => {  
    if(event) {
      event.preventDefault();  
    }
    
    this.setState( prevState => ({
        safed: true
      }
    ));

    console.log(this.state.userValues);

    db.collection("users").doc(this.state.user).set(this.state.userValues);
  }

  uploadFile = event => {
    console.log('filed changed');

    const input = event.target;
    var file = input.files[0];
    if(file.size > 1000000) {
      alert("Ihr Bild ist zu gross. Bitte nicht grösser als 1MB.");
    } else {
      var imageRef = storageRef.child(`${file.name}`);
      let filenameThumb = 'thumb_' + file.name;
  
      console.log(filenameThumb);
  
      this.setState(prevState => ({
          userValues: {
            ...prevState.userValues,
            'profilePic': filenameThumb
          },
          isUploadingFile: true,
        }), () => {
          console.log('put file to server');
          imageRef.put(file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            this.handleSubmit(); 
            setTimeout(() => {
              this.saveProfilePicUrl(filenameThumb);
            }, 8000); 
        });
      })  
    }
  }

  saveProfilePicUrl(filenameThumb) {
    storageRef.child(filenameThumb).getDownloadURL().then(url => {
      console.log(url); 
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

  getCatsAsList = (userCats) => {
    let catsAsList = {}; 
    
    Object.keys(userCats).forEach((key, index) => {
      catsAsList[key] = userCats[key].checked;
    })

    return catsAsList;
  }

  deleteUserData = () => {
    let response = window.confirm("Wollen Sie wirklich Ihr Konto und Profilseite löschen?");

    if(response) {
      console.log('yes delete');
      db.collection("users").doc(this.state.userValues.user).delete().then(() => {
        console.log("Document successfully deleted!");
        
        var user = auth.currentUser;
        
        user.delete().then(() => {
          console.log("User successfully deleted!");
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
          change: this.handleTextChange,
          label: 'E-Mail'
        },
        {
          type: 'text',
          name: 'birthdate',
          change: this.handleTextChange,
          label: 'Geburtstag'
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
                  <a onClick={ this.context.router.history.goBack }>zurück</a>
                  <span className="site-title">Mein Profil bearbeiten</span>
                  { isReadyToLoop &&
                    <Link className="link-right" to={`/user/${this.state.userValues.user}`}>Profil ansehen</Link>
                  }
                </div>
              </nav>
              <div className="container">
                <form onSubmit={this.handleSubmit}>
                  <section className="status">
                    <p className="title">Mein Status:</p>
                    { isReadyToLoop && 
                    <div className="options">
                      <StatusSelector change={this.handleRadioChange} searchingFor={this.state.userValues.status} userValues={this.state.userValues} />
                      <PublishSelector change={this.handlePublishChange} userValues={this.state.userValues} />
                      <button 
                        onClick={this.checkIfSaved} 
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
                      <input type="text" id="search" />
                      <div style={{display:'block',position:'relative',width:'100%',height:'500px'}} id="map"></div>
                    </div>
                  </section>
                </form>
                <section className="verwaltung">
                  <p className="title">Verwaltung</p>
                  <p 
                    onClick={this.deleteUserData} 
                    className={ isReadyToLoop ? this.state.userValues.status + " action" : undefined}
                  >
                    Alle meine Daten löschen
                  </p>
                </section>
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

  loadMap() {
    GoogleMapsLoader.KEY = process.env.REACT_APP_MAPS_KEY;
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
    GoogleMapsLoader.LANGUAGE = 'de';
    GoogleMapsLoader.REGION = 'DE';

    GoogleMapsLoader.load( (google) => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.43142, lng: 8.49187},
        zoom: 8,
        mapTypeId: 'roadmap', 
        styles: style
      });

      const geocoder = new google.maps.Geocoder();


      if(this.state.userValues.location) {
        console.log(this.state.userValues.location);

        geocoder.geocode({'location': this.state.userValues.location}, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              map.panTo(this.state.userValues.location);
              map.setZoom(18);
              var marker = new google.maps.Marker({
                position: this.state.userValues.location,
                map: map
              });
              console.log(results[0].formatted_address);
              document.getElementById('search').value = results[0].formatted_address;
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }

      var input = document.getElementById('search');
      var searchBox = new google.maps.places.SearchBox(input);

      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', () => {
        var places = searchBox.getPlaces();
        console.log(places[0].geometry.location.lat());
        const location = {lat: places[0].geometry.location.lat(), lng: places[0].geometry.location.lng() }; 

        this.setState(prevState => ({
          safed: false,
          userValues: {
            ...prevState.userValues,
            'location': location
            }
          })
        )

        if(places.length === 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }

          var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          markers.push(new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          }));

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    });

    GoogleMapsLoader.onLoad(function(google) {
      console.log('I just loaded google maps api');
    });
  }
}

export default Profile; 
