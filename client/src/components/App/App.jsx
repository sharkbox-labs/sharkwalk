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
      mapMarkers: [],
    };
  }

  componentDidMount() {}

  getDirections() {
    const destinationMarker = (
      <Marker
        key={'destination'}
        position={{ lat: this.state.destination.lat, lng: this.state.destination.lng }}
      />
    );

    const mapMarkers = [this.state.originMarker, destinationMarker];

    this.setState({
      mapMarkers,
    }, () => console.log('mapMarkers: ', this.state.mapMarkers));

    //=========================================

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

  setDestination(mapProps, map) {
    this.setState({
      destination: {
        lat: map.center.lat(),
        lng: map.center.lng(),
      }, 
    }, () => console.log('Current destination: ', this.state.destination));
  }

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
          origin: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          originMarker,
          mapMarkers: [originMarker],
        }, () => console.log('ORIGIN: ', this.state.origin));
      });
    } else {
      console.log('Geolocation is unavailable');
    }
  }

  renderMarkers() {

    return this.state.mapMarkers.map((marker) => {
      console.log('marker: ', marker);

      return marker;
    });
  }

  render() {
    const style = {
      width: '100vw',
      height: '90vh',
    };

    return (
      <div style={style}>
        <Nav getDirections={this.getDirections} />
        <Map google={this.props.google} onReady={this.setOriginMarker} onDragend={this.setDestination}>
          {this.renderMarkers()}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(App);
