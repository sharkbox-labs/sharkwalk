import Map, { Marker } from 'google-maps-react';
import React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import SearchBarHamburgerIcon from 'material-ui/svg-icons/navigation/menu';
import AutoComplete from 'material-ui/AutoComplete';
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
    borderRadius: '3px',
  };

  const searchToolbarGroupStyle = {
    width: '100%',
    // display: 'none',
  };

  const iconButtonStyle = {
    float: 'left',
  };

  const searchBarStyle = {};

  const getSearchResults = (query) => {
    // get search results for query
    // window.google.maps.places.SearchBox is a function...but don't know what it does
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
        <ToolbarGroup firstChild>
          <IconButton style={iconButtonStyle}>
            <SearchBarHamburgerIcon />
          </IconButton>
        </ToolbarGroup>
        <ToolbarGroup className="toolbar-group" style={searchToolbarGroupStyle}>
          <AutoComplete
            hintText="Search"
            fullWidth
            dataSource={['INSERT_DATA_HERE']}
            style={searchBarStyle}
            onNewRequest={getSearchResults}
          />
        </ToolbarGroup>
      </Toolbar>
    </div>
  );
};

App.propTypes = {
};

export default App;
