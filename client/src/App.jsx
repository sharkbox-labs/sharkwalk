import React, { Component } from 'react';
import './App.css';
import Nav from './Nav';
import Map, { GoogleApiWrapper } from 'google-maps-react';

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Map google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAOrEYQQAPOj1o3dvwWm2dnrU2MEockivg',
})(App);
