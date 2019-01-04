import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Link } from "react-router-dom";
import { db } from "../firebase";
import GoogleMapsLoader from 'google-maps';
import CategoryDisplay from '../components/CategoryDisplay.js';
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
    }), () => {
      console.log(this.state);
      if(this.state.userValues.public) {
        this.loadMap();
      }
    });
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
              <p>In diesen Bereichen {this.state.userValues.status } ich Hilfe{this.state.userValues.status == 'biete' ? ' an' : ''}:</p>
              { isReadyToLoop &&
                <CategoryDisplay userValues={this.state.userValues}/>
              }
                
              </section>
              <section className="map">
                <p>Hier wohnt {this.state.userValues.username}:</p>
                <div style={{display:'block',position:'relative',width:'100%',height:'500px'}} id="map"></div>
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
        styles: [
          {
            featureType: 'poi',
            stylers: [{visibility: 'off'}]
          },
          {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          }
        ]
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

export default User; 
