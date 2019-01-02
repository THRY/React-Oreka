import React, { Component } from 'react';
import GoogleMapsLoader from 'google-maps';
import pinSuche from '../images/pin-suche.svg';
import pinBiete from '../images/pin-biete.svg';
import style from '../functions/googleMapStyles.js';



class GoogleMaps extends Component {
  state = {
    filterResult: this.props.filterResult,
    map: '',
    google: '',
    markers: []
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.updatedAt);
    if(prevProps.updatedAt !== this.props.updatedAt) {
      this.updateMarkers();
    }
  }

  updateMarkers() {
    let { google, map } = this.state;

    console.log('updating markers');
    console.log(this.props.filterResult);

    this.state.markers.forEach(function(marker) {
      console.log('set marker to zero');
      marker.setMap(null);
    });

    let icons = {
      suche: {
        url: pinSuche
      },
      biete: {
        url: pinBiete
      }
    }

    var currentMarkers = [];

    this.props.filterResult.forEach((user, index)  => {
      console.log(icons[user.status].url);
      var icon = {
        url: icons[user.status].url,
        size: new google.maps.Size(25, 25),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      console.log(user.location); 

      // Create a marker for each place.
      currentMarkers.push(new google.maps.Marker({
          icon: icon,
          map: map,
          title: 'pipi',
          position: user.location,
          animation: google.maps.Animation.DROP,
          id: 'pin-' + user.user
        })
      );

      var contentString = 
        '<div id="map-popup">'+
          `<h1 id="firstHeading" class="firstHeading">${user.username}</h1>`+
          '<div id="bodyContent">'+
          `<p>${user.description}</p>`+
          '</div>'+
        '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
      });

      google.maps.event.addListener(currentMarkers[index], 'click', function(event) {
        //window.location.href = this.url;
        console.log(currentMarkers[index].id)
        infowindow.open(map, currentMarkers[index]);
        console.log('klicky');
      });

      google.maps.event.addListener(currentMarkers[index], 'mouseover', function() {
        //window.location.href = this.url;
        const listItem = document.getElementById('listitem-' + user.user);
        listItem.classList.add("hovered");
        console.log('hovery');
      });

      google.maps.event.addListener(currentMarkers[index], 'mouseout', function() {
        //window.location.href = this.url;
        const listItem = document.getElementById('listitem-' + user.user);
        listItem.classList.remove("hovered");
        console.log('hovery');
      });
    })

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < currentMarkers.length; i++) {
      bounds.extend(currentMarkers[i].getPosition());
    }

    map.fitBounds(bounds);

    this.setState(prevState => ({
        markers: currentMarkers
      })
    )
  }

  loadMap() {
    GoogleMapsLoader.KEY = process.env.REACT_APP_MAPS_KEY;
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
    GoogleMapsLoader.LANGUAGE = 'de';
    GoogleMapsLoader.REGION = 'DE';

    GoogleMapsLoader.load( (google) => {
      const map = new google.maps.Map(document.getElementById('component-map'), {
        center: {lat: 47.43142, lng: 8.49187},
        zoom: 8,
        maxZoom: 13,
        mapTypeId: 'roadmap', 
        mapTypeControl: false,
        streetViewControl: false,
        styles: style
      });

      const geocoder = new google.maps.Geocoder();

      /*
      var input = document.getElementById('search-component-map');
      var searchBox = new google.maps.places.SearchBox(input);
      */

      console.log(this.props.filterResult);

    GoogleMapsLoader.onLoad(function(google) {
      console.log('I just loaded google maps api');
    });

    this.setState(prevState => ({
        google: google,
        map: map
      }), () => {
        this.updateMarkers();
      }
    )
  });
}


  render() {
    return (
      <div style={{display:'block',position:'relative',width:'100%',height:'500px'}} id="component-map"></div>
    )
  } 
}

export default GoogleMaps;
