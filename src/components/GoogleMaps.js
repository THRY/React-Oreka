import React, { Component } from 'react';
import GoogleMapsLoader from 'google-maps';
import pinSuche from '../images/pin-suche-b.svg';
import pinBiete from '../images/pin-biete-b.svg';
import style from '../functions/googleMapStyles.js';
import avatar from '../images/avatar.svg';




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
    if(prevProps.updatedAt !== this.props.updatedAt) {
      this.updateMarkers();
    }
  }

  updateMarkers() {
    let { google, map } = this.state;

    this.state.markers.forEach(function(marker) {
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

    let currentMarkers = [];
    let markerIndex = 0; 

    this.props.filterResult.forEach((user, index)  => {
      if(Object.keys(user.location).length > 0) {
        var icon = {
          url: icons[user.status].url,
          size: new google.maps.Size(35, 35),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35)
        };

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

        let profilePicUrl;
        if(user.profilePicUrl) {
          profilePicUrl = user.profilePicUrl
        } else {
          profilePicUrl = avatar;
        } 

        var contentString = 
          `<div id="map-popup" class=${user.status}>`+
            `<div class="imageCropper">
              <img src=${profilePicUrl}>
            </div>` +
            `<h2>${user.username}</h2>`+
            `<p>${user.description}</p>`+
            `<p><a href="./user/${user.user}">zum Profil</a></p>`+
          '</div>';

        let infowindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 200
        });

        google.maps.event.addListener(currentMarkers[markerIndex], 'click', function(event) {
          infowindow.open(map, this);
        });

        google.maps.event.addListener(currentMarkers[markerIndex], 'mouseover', function() {
          //window.location.href = this.url;
          const listItem = document.getElementById('listitem-' + user.user);
          if(listItem) {
            listItem.classList.add("hovered");
          }
        });

        google.maps.event.addListener(currentMarkers[markerIndex], 'mouseout', function() {
          //window.location.href = this.url;
          const listItem = document.getElementById('listitem-' + user.user);
          if(listItem) {
            listItem.classList.remove("hovered");
          }
        });

        google.maps.event.addListener(map, "click", function(event) {
          infowindow.close();
        });

        markerIndex++;
      }
    })

    if(currentMarkers.length > 0) {
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < currentMarkers.length; i++) {
        bounds.extend(currentMarkers[i].getPosition());
      }
      map.fitBounds(bounds);
    }

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
        maxZoom: 15,
        mapTypeId: 'roadmap', 
        mapTypeControl: false,
        streetViewControl: false,
        styles: style,
        fullscreenControl: false
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
