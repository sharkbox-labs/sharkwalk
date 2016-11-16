import Map, { GoogleApiWrapper, Marker } from 'google-maps-react';
import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import qs from 'qs';
import './App.css';
import Nav from '../Nav/Nav';
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

        this.setState({
          originMarker,
          destinationMarker,
          origin: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          mapMarkers: [originMarker],
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
    this.setState({
      mapMarkers: [this.state.originMarker, this.state.destinationMarker],
    });
  }

  render() {
    const style = {
      width: '100vw',
      height: '100vh',
    };

    const imgStyle = {
      position: 'absolute',
      'z-index': '10',
      height: 'auto',
      width: '45px',
      border: 'solid 1px red',
      top: '45%', //43
      left: '45%', //46.75
    };

    return (
      <div style={style}>
        <Nav getDirections={this.getDirections} />
        <Map
          google={this.props.google} // this.props.google is given by the google-maps-react module
          onReady={this.setDefaultMarkers}
          onDragend={this.setDestination}
        >
          <img src={'http://maplacejs.com/website/images/red-dot.png'} style={imgStyle} />
          {this.state.mapMarkers}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(App);
