import Map, { GoogleApiWrapper, Marker } from 'google-maps-react';
import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import qs from 'qs';
import './App.css';
import Nav from '../Nav/Nav';
import googleApiKey from '../../apiKeys/googleApiKey';
import GoogleMap from '../GoogleMap/GoogleMap';

injectTapEventPlugin();

class App extends Component {
  constructor(props) {
    super(props);

    this.serverUrl = /^(development|test)$/.test(process.env.NODE_ENV) ? 'http://localhost:3000' : '';

    this.getDirections = this.getDirections.bind(this);

    this.state = {
      origin: {
        lat: '',
        long: '',
      },
      destination: {
        lat: '',
        long: '',
      },
    };
  }

  componentDidMount() {
    // setTimeout(() => this.setState({ showMarker: true }), 3000);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          origin: {
            lat: position.coords.latitude,
            long: position.coords.longitude,
          },
        });

        console.log('lat: ', position.coords.latitude);
        console.log('long: ', position.coords.longitude);
      });
    } else {
      console.log('Geolocation is unavailable');
    }
    setTimeout(() => {this.props.google.maps.event.trigger(this.map, 'ready'); this.forceUpdate();}, 2000);
  }

  getDirections() {
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


  render() {
    const style = {
      width: '100vw',
      height: '90vh',
    };
    return (
      <div style={style}>
        <Nav getDirections={this.getDirections} />
        <Map google={this.props.google}>
          <Marker
            position={{ lat: 37.778519, lng: -122.405640 }}
            name={'Current location'} />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(App);
