import React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import SearchBarHamburgerIcon from 'material-ui/svg-icons/navigation/menu';
import AutoComplete from 'material-ui/AutoComplete';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Map, { Marker } from 'google-maps-react';
import Drawer from 'material-ui/Drawer';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MapsNavigation from 'material-ui/svg-icons/maps/navigation';
import './App.css';
import RiskPath from '../RiskPath/RiskPath';
import appHelper from '../utils/appHelper';

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
  
  // Create immutable interaction types for components to use
  const interactionTypes = {
    VIEWING_MAP: 'VIEWING_MAP',
    SEARCHING_ORIGIN: 'SEARCHING_ORIGIN',
    SEARCHING_DESTINATION: 'SEARCHING_DESTINATION',
    SELECTING_ROUTE: 'SELECTING_ROUTE',
    VIEWING_SIDEBAR: 'VIEWING_SIDEBAR',
  };

  return (
    <div className="app-container" style={appContainerStyle} >
      <Drawer
        docked={false}
        width={300}
        open={props.interactionType === interactionTypes.VIEWING_SIDEBAR}
      />
      <div className="map-container" style={mapContainerStyle}>
        <Map
          className="map"
          google={window.google} // eslint-disable-line
          onReady={() => (
            appHelper.getCurrentLocation(props.changeOrigin, props.dispatch)
          )} // this.setDefaultMarkers
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
        <ToolbarGroup firstChild className="toolbar-group">
          <IconButton
            style={iconButtonStyle}
            onClick={() => (
              appHelper.toggleInteractionTypeFromMenuClick(
                props.interactionType,
                props.changeInteractionType,
                interactionTypes,
              )
            )}
          >
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
      <FloatingActionButton className="floating-action-button-show">
        <MapsNavigation />
      </FloatingActionButton>
    </div>
  );
};

App.propTypes = {
  destination: React.PropTypes.shape({
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
  }),
  interactionType: React.PropTypes.string.isRequired,
  origin: React.PropTypes.shape({
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
  }),
  changeDestination: React.PropTypes.func.isRequired,
  changeInteractionType: React.PropTypes.func.isRequired,
  changeOrigin: React.PropTypes.func.isRequired,
  changeRoute: React.PropTypes.func.isRequired,
  changeRouteResponse: React.PropTypes.func.isRequired,
};

export default App;
