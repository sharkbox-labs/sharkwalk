import Map, { Marker } from 'google-maps-react';
import React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import SearchBarHamburgerIcon from 'material-ui/svg-icons/navigation/menu';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './App.css';
import RiskPath from '../RiskPath/RiskPath';

injectTapEventPlugin();

const App = (props) => {
  // These styles are for development only, remove for production
  const mapStyle = {};
  const appContainerStyle = {};
  const mapContainerStyle = {};

  const searchToolbarStyle = {
    backgroundColor: 'white',
    position: 'absolute',
    top: '2%',
    left: '5%',
    right: '5%',
  };

  return (
    <div className="app-container" style={appContainerStyle} >
      
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
      <Toolbar className="search-toolbar" style={searchToolbarStyle}>
        <ToolbarGroup className="toolbar-group">
          <IconButton>
            <SearchBarHamburgerIcon />
          </IconButton>
        </ToolbarGroup>
      </Toolbar>

    </div>
  );
};

App.propTypes = {
};

export default App;
