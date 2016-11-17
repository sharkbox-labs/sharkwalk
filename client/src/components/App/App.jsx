import Map, { GoogleApiWrapper, Marker } from 'google-maps-react';
import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import qs from 'qs';
import './App.css';
import Nav from '../Nav/Nav';
import Direction from '../Direction/Direction';
import googleApiKey from '../../apiKeys/googleApiKey';

injectTapEventPlugin();

class App extends Component {
  constructor(props) {
    super(props);

    this.serverUrl = /^(development|test)$/.test(process.env.NODE_ENV) ? 'http://localhost:3000' : '';

    // bind custom methods to App scope
    this.getDirections = this.getDirections.bind(this);
    this.setDestination = this.setDestination.bind(this);
    this.setDefaultMarkers = this.setDefaultMarkers.bind(this);
    this.addDestinationMarker = this.addDestinationMarker.bind(this);

    this.state = {
      origin: {
        lat: '',
        lng: '',
      },
      destination: {
        lat: '',
        lng: '',
      },
      originMarker: '',
      destinationMarker: '',
      mapMarkers: [], // [originMarker, destinationMarker]
    };
  }

  /*
  ========
    Will make a GET request to the server for directions:
  ========
  */

  getDirections() {
    // addDestinationMarker can be called upon a successful GET request
    // if we don't want to render a pin until the route is given.
    this.addDestinationMarker();

    const queryObj = {
      origin: this.state.origin,
      destination: this.state.destination,
    };

    const queryString = qs.stringify(queryObj);

    axios.get(`${this.serverUrl}/api/trip?${queryString}`)
      .then((response) => {
        // response object will have directions with risk factor
        // need to display on map (maybe done in map component?)
      })
      .catch((error) => {
        // handle error
      });
  }

  /*
  ========
    Will set the current destination (center of the map):
  ========
  */

  setDestination(mapProps, map) {
    // 'mapProps' and 'map' are required by the google-maps-react module
    // when using the onDragend event listener
    const destinationMarker = (
      <Marker
        key={'destination'}
        position={{ lat: map.center.lat(), lng: map.center.lng() }}
      />
    );

    this.setState({
      destinationMarker,
      destination: {
        lat: map.center.lat(),
        lng: map.center.lng(),
      },
    });
  }

  /*
  ========
    Will set a marker on the map for the user's geolocation:
  ========
  */

  setDefaultMarkers(mapProps, map) {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Create origin marker (user's geolocation)
        const originMarker = (
          <Marker
            key={'origin'}
            position={{ lat: position.coords.latitude, lng: position.coords.longitude }}
          />
        );

        // Create default value for destination marker--'map.center' is
        // currently hardcoded to the center of SF in the google-maps-react module.
        // This will only update if the map is dragged.
        const destinationMarker = (
          <Marker
            key={'destination'}
            position={{ lat: map.center.lat(), lng: map.center.lng() }}
          />
        );

        const direction = (
          <Direction directionsResponse={{}} />
        );

        this.setState({
          originMarker,
          destinationMarker,
          origin: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          mapMarkers: [originMarker, direction],
        });
      });
    } else {
      console.log('Geolocation is unavailable');
    }
  }

  /*
  ========
    Will add a marker on the map for the selected destination:
  ========
  */

  addDestinationMarker() {
    // remove center map marker
    this.centerMapPin.className = 'center-map-pin-hide';
    // and set the marker on the map permanently
    this.setState({
      mapMarkers: [this.state.originMarker, this.state.destinationMarker],
    });
  }

  render() {
    // These styles are for development only, remove for production
    const mapStyle = {};
    const appContainerStyle = {};
    const navStyle = {};
    const mapContainerStyle = {};

    return (
      <div className="app-container" style={appContainerStyle} >
        <div className="nav-container">
          <Nav
            className="nav-bar"
            getDirections={this.getDirections}
            style={navStyle}
          />
        </div>
        <div className="map-container" style={mapContainerStyle}>
          <Map
            className="map"
            google={this.props.google} // eslint-disable-line
            onReady={this.setDefaultMarkers}
            onDragend={this.setDestination}
            onClick={this.setDestination}
            style={mapStyle}
          >
            <img
              className="center-map-pin"
              ref={(c) => { this.centerMapPin = c; }}
              role="presentation"
              src="default-marker.png"
            />
            {this.state.mapMarkers}
          </Map>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(App);
