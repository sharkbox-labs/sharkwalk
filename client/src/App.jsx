import React, { Component } from 'react';
import Map, { GoogleApiWrapper } from 'google-maps-react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import qs from 'qs';
import './App.css';
import Nav from './Nav';
import googleApiKey from './apiKeys/googleApiKey';

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
      <div>
        <Nav getDirections={this.getDirections} />
        <Map google={this.props.google} style={style} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(App);
