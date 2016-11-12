import React, { Component } from 'react';
import './App.css';
import Nav from './Nav';
import GoogleMap from './GoogleMap';

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <GoogleMap />
      </div>
    );
  }
}

export default App;
