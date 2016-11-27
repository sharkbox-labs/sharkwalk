import React from 'react';
import classNames from 'classnames';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import SearchBarHamburgerIcon from 'material-ui/svg-icons/navigation/menu';
import OriginIcon from 'material-ui/svg-icons/device/gps-fixed';
import DestinationIcon from 'material-ui/svg-icons/communication/location-on';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Map, { Marker } from 'google-maps-react';
import Drawer from 'material-ui/Drawer';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MapsNavigation from 'material-ui/svg-icons/maps/navigation';
import Close from 'material-ui/svg-icons/navigation/close';
import './App.css';
import RiskPath from '../RiskPath/RiskPath';
import appHelper from '../utils/appHelper';

injectTapEventPlugin();

const App = (props) => {
  // These styles are for development only, remove for production
  const mapStyle = {};
  const appContainerStyle = {};
  const mapContainerStyle = {};
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

  const searchBarToolbarClasses = classNames({
    'search-toolbar-hide': props.interactionType === interactionTypes.SELECTING_ROUTE || props.interactionType === interactionTypes.VIEWING_SIDEBAR,
    'search-toolbar-show': props.interactionType !== interactionTypes.SELECTING_ROUTE && props.interactionType !== interactionTypes.VIEWING_SIDEBAR,
  });

  const searchResultsCardsClasses = classNames({
    'search-results-hide': props.interactionType !== interactionTypes.SEARCHING_DESTINATION && props.interactionType !== interactionTypes.SEARCHING_ORIGIN,
    'search-results-show': props.interactionType === interactionTypes.SEARCHING_DESTINATION || props.interactionType === interactionTypes.SEARCHING_ORIGIN,
  });

  const selectingRouteToolbarClasses = classNames({
    'selecting-route-toolbar-hide': props.interactionType !== interactionTypes.SELECTING_ROUTE,
    'selecting-route-toolbar-show': props.interactionType === interactionTypes.SELECTING_ROUTE,
  });

  const sendToGoogleMapsButtonClasses = classNames({
    'floating-action-button-hide': props.interactionType !== interactionTypes.SELECTING_ROUTE,
    'floating-action-button-show': props.interactionType === interactionTypes.SELECTING_ROUTE,
  });

  // Create the autocomplete objects and associate it with the UI input controls.
  // Restrict the search to San Francisco
  const defaultBounds = new window.google.maps.LatLngBounds(
    new window.google.maps.LatLng(37.7000, -122.5200),
    new window.google.maps.LatLng(37.8100, -122.3500),
  );

  const search = document.getElementById('autocompleteSearch');
  const origin = document.getElementById('autocompleteOrigin');
  const destination = document.getElementById('autocompleteDestination');

  const options = {
    bounds: defaultBounds,
  };

  const autocompleteSearch = new window.google.maps.places.Autocomplete(search, options); // eslint-disable-line
  const autocompleteOrigin = new window.google.maps.places.Autocomplete(origin, options); // eslint-disable-line
  const autocompleteDestination = new window.google.maps.places.Autocomplete(destination, options); // eslint-disable-line


  return (
    <div className="app-container" style={appContainerStyle} >
      <Drawer
        docked={false}
        width={300}
        open={props.interactionType === interactionTypes.VIEWING_SIDEBAR}
      >
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
          <Close />
        </IconButton>
        <FlatButton label="About" />
        <FlatButton label="Fork Me On GitHub" />
      </Drawer>
      <Toolbar
        className={selectingRouteToolbarClasses}
        onClick={() => { props.changeInteractionType('SEARCHING_ORIGIN'); }}
      >
        <ToolbarGroup className="searchbar-toolbar-group">
          <OriginIcon />
          <TextField
            placeholder=""
            fullWidth
            hintText="Origin"
            id="autocompleteOrigin"
            onClick={() => {
              props.changeInteractionType('SEARCHING_DESTINATION');
            }}
            onNewRequest={getSearchResults}
            style={searchBarStyle}
          />
        </ToolbarGroup>
      </Toolbar>
      <Toolbar
        className={selectingRouteToolbarClasses}
        onClick={() => { props.changeInteractionType('SEARCHING_DESTINATION'); }}
      >
        <ToolbarGroup className="searchbar-toolbar-group">
          <DestinationIcon />
          <TextField
            placeholder=""
            fullWidth
            hintText="Destination"
            id="autocompleteDestination"
            onClick={() => {
              props.changeInteractionType('SEARCHING_DESTINATION');
            }}
            onNewRequest={getSearchResults}
            style={searchBarStyle}
          />
        </ToolbarGroup>
      </Toolbar>
      <div className="map-container" style={mapContainerStyle}>
        <Map
          className="map"
          google={window.google}
          onReady={() => (
            props.changeOrigin(props.dispatch)
          )}
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
      <Toolbar className={searchBarToolbarClasses}>
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
        <ToolbarGroup className="searchbar-toolbar-group">
          <TextField
            placeholder=""
            fullWidth
            hintText="Search"
            id="autocompleteSearch"
            onClick={() => {
              props.changeInteractionType('SEARCHING_DESTINATION');
            }}
            onNewRequest={getSearchResults}
            style={searchBarStyle}
          />
        </ToolbarGroup>
      </Toolbar>
      <Card
        className={`${searchResultsCardsClasses} current-location-card`}
        onClick={() => { props.changeInteractionType('SELECTING_ROUTE'); }}
      >
        <CardHeader
          title="URL Avatar"
          subtitle="Subtitle"
          avatar="images/jsa-128.jpg"
        />
      </Card>
      <Card
        className={`${searchResultsCardsClasses} search-results-card`}
        onClick={() => { props.changeInteractionType('SELECTING_ROUTE'); }}
      >
        <CardHeader
          title="URL Avatar"
          subtitle="Subtitle"
          avatar="images/jsa-128.jpg"
        />
        <CardTitle title="Card title" subtitle="Card subtitle" />
        <CardText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions>
          <FlatButton label="Action1" />
          <FlatButton label="Action2" />
        </CardActions>
      </Card>
      <FloatingActionButton className={sendToGoogleMapsButtonClasses}>
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
