import Map, { Marker } from 'google-maps-react';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import Nav from '../Nav/Nav';
import RiskPath from '../RiskPath/RiskPath';

injectTapEventPlugin();

const App = (props) => {
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
          getDirections={''} // this.getDirections
          style={navStyle}
        />
      </div>
      <div className="map-container" style={mapContainerStyle}>
        <Map
          className="map"
          google={window.google} // eslint-disable-line
          onReady={''} // this.setDefaultMarkers
          onDragend={''} // this.setDestination
          onClick={''} // this.setDestination
          style={mapStyle}
        >

          <Marker
            key={'origin'}
            position={props.origin}
            google={window.google}
          />
          <Marker
            key={'destination'}
            position={props.destination}
            google={window.google}
          />
          <RiskPath 
            points={props.routeResponse.path}
          />
        </Map>
      </div>
    </div>
  );
};

export default App;
