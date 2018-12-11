import React, { Component } from 'react';
import Layout from './components/Layout';
import { Link } from "react-router-dom";
import { storageRef, db } from "./firebase";
import GoogleMapsLoader from 'google-maps';

class Profile extends Component {
  state = {
    isReadyToLoop: false
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
        ...data,
        categories: {}
     }
    }), () => {
      console.log(this.state);
      this.loadMap();
      this.getProfilePicUrl();
    });
  }

  handleTextChange = event => {
    const { id, value} = event.target
    this.setState( prevState => ({
      userValues: {
        ...prevState.userValues,
        [id]: value
     }
    }), () => console.log(this.state));
  }

  handleRadioChange = event => {
    const { name, value} = event.target
    this.setState( prevState => ({
      userValues: {
        ...prevState.userValues,
        [name]: value
     }
    }), () => console.log(this.state));
  }

  handleCheckboxChange = event => {
    const { id, checked } = event.target
    this.setState( prevState => ({
      userValues: {
        ...prevState.userValues,
        [id]: checked
     }
    }), () => console.log(this.state));
  }

  handleCatCheckboxChange = event => {
    const { id, checked } = event.target
    this.setState( prevState => ({
      userValues: {
        ...prevState.userValues,
        categories: {
          ...prevState.userValues.categories,
          [id]: checked
        }
      }
    }), () => console.log(this.state));
  }

  handleSubmit = event => {  
    event.preventDefault();  
    db.collection("users").doc(this.state.user).set(this.state.userValues);
  }

  uploadFile = event => {
    const input = event.target;
    var file = input.files[0];
    var imageRef = storageRef.child(`${file.name}`);

    this.setState(prevState => ({
        userValues: {
          ...prevState.userValues,
          'profilePic': file.name
        }
      })
    ) 

    console.log(file.name);
    
    imageRef.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
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

    let radios = [
      {
        type: 'radio',
        name: 'status1',
        radioName: 'status',
        value: 'suche',
        change: this.handleRadioChange,
        label: 'suche'
      },
      {
        type: 'radio',
        name: 'status2',
        radioName: 'status',
        value: 'biete',
        change: this.handleRadioChange,
        label: 'biete'
      },
    ]

    let fields = [
        {
          type: 'checkbox',
          name: 'public',
          change: this.handleCheckboxChange,
          label: 'Veröffentlicht'
        },
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

    let categories = [
      {
        type: 'checkbox',
        case: 'category',
        name: 'haushalt',
        change: this.handleCheckboxChange,
        label: 'Haushalt'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'garten',
        change: this.handleCheckboxChange,
        label: 'Garten'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'einkaufen',
        change: this.handleCheckboxChange,
        label: 'Einkaufen'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'finanzen',
        change: this.handleCheckboxChange,
        label: 'Finanzen'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'behoerden',
        change: this.handleCheckboxChange,
        label: 'Behörden'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'computer',
        change: this.handleCheckboxChange,
        label: 'Computer'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'transport',
        change: this.handleCheckboxChange,
        label: 'Transport'
      },
      {
        type: 'checkbox',
        case: 'category',
        name: 'spezial',
        change: this.handleCheckboxChange,
        label: 'Spezial'
      },
    ]

    

    return (
          <Layout>
            { isSignedIn ? (
              <>
              <nav class={isReadyToLoop && this.state.userValues.status}>
                <div class="container">
                  <Link to="/">zurück</Link>
                  <p>Mein Profil</p>
                </div>
              </nav>
              <div className="container">
                
                
                <form onSubmit={this.handleSubmit}>
                  <section className="status">
                    <p className="title">Mein Status:</p>
                    <div>                 
                    {    
                      radios.map((field, index) => 
                        <>
                          { isReadyToLoop && this.externalFunction(field) }
                          { isReadyToLoop ? 
                            <label htmlFor={field.name} className={this.state.userValues.status}>
                            <p>{field.label}</p>  
                            </label>
                          : '' }
                        </>
                      )
                    }
                    </div>
                  </section>
                  <section>                    
                    <p className="title">Angaben zu mir: </p>
                    <div className="profile-top">
                      <div className="profile left">
                        <div className="image-cropper">
                          { isReadyToLoop ?
                          <img alt="participant" id="myimg" src={this.state.profilePicUrl} className="papipapo"/>
                            : '' }
                        </div>
                        <input type='file' onChange={ this.uploadFile }></input>
                      </div>
                      <div className="profile right">
                        {                    
                          fields.map((field, index) => 
                            <div key={index}>
                              <label htmlFor={field.name}>{field.label}</label>
                              { isReadyToLoop && this.externalFunction(field) }
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </section>
                  <section>
                    <p className="title">Bereiche, in denen ich Hilfe {isReadyToLoop && this.state.userValues.status === 'suche' ? 'suche' : 'anbiete' }:</p>
                    <div className="category-bar">
                    {                    
                      categories.map((field, index) => 
                        <div key={index} name={field.name}>
                          { isReadyToLoop && this.externalFunction(field) }
                          { isReadyToLoop ? (
                            <>
                            <label htmlFor={field.name} className={this.state.userValues.status}>
                              <div className={field.name + ' logo'}></div>
                            </label>
                            <p>{(field.name == 'spezial' ? field.label + ` (${this.state.userValues.spezialDescr})` : field.label ) }</p>
                            </>
                          ) : '' }
                        </div>
                      )
                    }
                    </div>
                  </section>
                  <section>
                    <p className="title">Mein Wohnort</p>
                    <input type="text" id="search" />
                    <div style={{display:'block',position:'relative',width:'100%',height:'500px'}} id="map"></div>
                  </section>
                  <button>Alle Daten speichern</button>
                </form>
              </div>
              </>
            ) : 
            (
              <p>Sie müssen eingeloggt sein, um Ihr Profil ansehen zu können.</p>
            )
          }
        </Layout>  
    )
  }

  externalFunction(field) {
    switch(field.type) {
      case 'checkbox':
        return (
          <input 
            id={field.name} 
            name={field.name} 
            type={field.type} 
            onChange={field.change} 
            checked={this.state.userValues[field.name] || false } 
          />
        );
      case 'checkbox-spezial':
        return (
          <input 
            id={field.name} 
            name={field.name} 
            type={field.type} 
            onChange={field.change} 
            checked={this.state.userValues[field.name] || false } 
          />
        );
      case 'textarea':
        return (
            <textarea 
              id={field.name} 
              name={field.name} 
              type={field.type} 
              onChange={field.change}
              value={this.state.userValues[field.name]}
            />
        );
      case 'radio': 
          return (
            <input 
              id={field.name} 
              name={field.radioName} 
              type={field.type} 
              value={field.value} 
              onChange={this.handleRadioChange} 
              checked={(this.state.userValues.status === field.value ? true : false)}
            />
          )
      default:
      case 'text':
        return (
            <input 
              id={field.name} 
              name={field.name} 
              type={field.type} 
              onChange={field.change}
              defaultValue={this.state.userValues[field.name]}
            />
        );
    }
  }

  loadMap() {
    GoogleMapsLoader.KEY = 'AIzaSyDLvGyZym2wxHq1yWFe4gF3EZAT90bJOb0';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
    GoogleMapsLoader.LANGUAGE = 'de';
    GoogleMapsLoader.REGION = 'DE';

    GoogleMapsLoader.load( (google) => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.43142, lng: 8.49187},
        zoom: 8,
        mapTypeId: 'roadmap'
      });

      const geocoder = new google.maps.Geocoder();


      if(this.state.userValues.location) {
        console.log(this.state.userValues.location);
        /*
        const marker = new google.maps.Marker({
          map: map,
          position: this.state.location
        });

        map.setZoom(10);
        map.panTo(marker.position);
        */

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
