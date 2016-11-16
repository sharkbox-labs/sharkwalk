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
    this.setOriginMarker = this.setOriginMarker.bind(this);
    this.addDestinationMarker = this.addDestinationMarker.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);

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

  setOriginMarker() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const originMarker = (
          <Marker
            key={'origin'}
            position={{ lat: position.coords.latitude, lng: position.coords.longitude }}
          />
        );

        this.setState({
          originMarker,
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

  /*
  ========
    Will render all markers
  ========
  */

  renderMarkers() {
    return this.state.mapMarkers.map(marker => marker);
  }

  render() {
    const style = {
      width: '100vw',
      height: '90vh',
    };

    return (
      <div style={style}>
        <Nav getDirections={this.getDirections} />
        <Map
          google={this.props.google} // this.props.google is given by the google-maps-react module
          onReady={this.setOriginMarker}
          onDragend={this.setDestination}
        >
          {this.renderMarkers()}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(App);
