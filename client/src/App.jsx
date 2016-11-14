import React, { Component } from 'react';
import Map, { GoogleApiWrapper } from 'google-maps-react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import Nav from './Nav';
import googleApiKey from './apiKeys/googleApiKey';

injectTapEventPlugin();

class App extends Component {
  render() {
    const style = {
      width: '100vw',
      height: '90vh',
    };

    return (
      <div>
        <Nav />
        <Map google={this.props.google} style={style} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(App);
