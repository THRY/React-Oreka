import React, { Component } from 'react';
import Layout from './components/Layout';
import { auth, signUp, signOut, logIn, db } from "./firebase";
import GoogleMapsLoader from 'google-maps';

class Profile extends Component {
  state = {
    user: '',
  }

  loadMap = () => {
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

      const geocoder = new google.maps.Geocoder;


      if(this.state.location) {
        console.log(this.state.location);
        /*
        const marker = new google.maps.Marker({
          map: map,
          position: this.state.location
        });

        map.setZoom(10);
        map.panTo(marker.position);
        */

        geocoder.geocode({'location': this.state.location}, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              map.panTo(this.state.location);
              map.setZoom(18);
              var marker = new google.maps.Marker({
                position: this.state.location,
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
        var currentState = this.state; 
        console.log(places[0].geometry.location.lat());
        const location = {lat: places[0].geometry.location.lat(), lng: places[0].geometry.location.lng() }; 
        currentState.location = location;

        this.setState((state) => {
          return currentState          
        })

        if (places.length === 0) {
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

  componentWillMount() {
    this.setState(state => {
      return {
        user: this.props.match.params.value
      }      
    }, () => {
      db.collection("users").doc(this.state.user)
        .onSnapshot(this.handleOnNext, this.handleOnError);
    });
  }

  handleOnNext = (doc) =>  {
    const data = doc.data();
    this.setState( state => {
      return {
          ...state, ...data
        }
      }, () => {
        console.log(this.state);
        this.loadMap()
      });
  }

  handleChange = event => {  
    var stateCopy = this.state;
    console.log(event.target.id)
    if(event.target.type === 'checkbox') {
      stateCopy[`${event.target.id}`] = event.target.checked;
    } else if(event.target.type === 'radio') {
      stateCopy[`${event.target.name}`] = event.target.value;
    } else {
      stateCopy[`${event.target.id}`] = event.target.value
    }

    this.setState( state => {
      return stateCopy
    }, () => console.log(this.state));
  }

  handleSubmit = event => {  
    event.preventDefault();  
    db.collection("users").doc(this.state.user).set(this.state);

    console.log(this.state);
    /*
    fetch('/api/form-submit-url', {
      method: 'POST',
      body: data,
    });
    */
  }

  render() {
    return (
      <Layout>
        <p>Profil von User: {this.props.match.params.value}</p>  
        <div style={{display:'block',position:'relative',width:'50PX',height:'50px'}} className={'bg-color-' + this.state.status} id="colortest"></div>

        <form onSubmit={this.handleSubmit}>

        <label htmlFor="status1">suche</label>
        <input id="status1" name="status" type="radio" value="suche" onChange={this.handleChange} checked={(this.state.status === 'suche' ? true : false)}/>

        <label htmlFor="status2">biete</label>
        <input id="status2" name="status" type="radio" value="biete" onChange={this.handleChange} checked={(this.state.status === 'biete' ? true : false)} />

        <label htmlFor="username">Enter username</label>
        <input id="username" name="username" type="text" onChange={this.handleChange} defaultValue={this.state.username} />

        <textarea id="description" name="description" onChange={this.handleChange} value={this.state.description} ></textarea>

        <label htmlFor="email">Enter your email</label>
        <input id="email" name="email" type="email" onChange={this.handleChange} defaultValue={this.state.email} />

        <label htmlFor="birthdate">Enter your birth date</label>
        <input id="birthdate" name="birthdate" type="text" onChange={this.handleChange} defaultValue={this.state.birthdate}/>

        <label htmlFor="haushalt">Haushalt</label>
        <input id="haushalt" name="haushalt" type="checkbox" onChange={this.handleChange} checked={this.state.haushalt || false} />

        <label htmlFor="garten">Garten</label>
        <input id="garten" name="garten" type="checkbox" onChange={this.handleChange} checked={this.state.garten || false} />

        <label htmlFor="einkaufen">Einkaufen</label>
        <input id="einkaufen" name="einkaufen" type="checkbox" onChange={this.handleChange} checked={this.state.einkaufen || false} />

        <label htmlFor="finanzen">Finanzen</label>
        <input id="finanzen" name="finanzen" type="checkbox" onChange={this.handleChange} checked={this.state.finanzen || false} />

        <label htmlFor="behoerden">Behörden</label>
        <input id="behoerden" name="behoerden" type="checkbox" onChange={this.handleChange} checked={this.state.behoerden || false} />

        <label htmlFor="computer">Computer</label>
        <input id="computer" name="computer" type="checkbox" onChange={this.handleChange} checked={this.state.computer || false} />

        <label htmlFor="transport">Transport</label>
        <input id="transport" name="transport" type="checkbox" onChange={this.handleChange} checked={this.state.transport || false} />

        <label htmlFor="spezial">Spezial {(this.state.spezialDescr ? `(${this.state.spezialDescr})` : '')}</label>
        <input id="spezial" name="spezial" type="checkbox" onChange={this.handleChange} checked={this.state.spezial || false} />

        <label htmlFor="spezialDescr">Mein Spezial-Skill</label>
        <input id="spezialDescr" name="spezialDescr" type="text" onChange={this.handleChange} defaultValue={this.state.spezialDescr}/>

        <input type="text" id="search" />
        <div style={{display:'block',position:'relative',width:'100%',height:'500px'}} id="map"></div>
        <button>Alle Daten speichern</button>
      </form>

     
      </Layout>  
    )
  }
}

export default Profile; 