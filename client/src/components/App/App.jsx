import React from 'react';
import classNames from 'classnames';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import { Card } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import SearchBarHamburgerIcon from 'material-ui/svg-icons/navigation/menu';
import OriginIcon from 'material-ui/svg-icons/device/gps-fixed';
import DestinationIcon from 'material-ui/svg-icons/communication/location-on';
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

  const searchCardsClasses = classNames({
    'search-cards-hide': props.interactionType !== interactionTypes.SEARCHING_DESTINATION && props.interactionType !== interactionTypes.SEARCHING_ORIGIN,
    'search-cards-show': props.interactionType === interactionTypes.SEARCHING_DESTINATION || props.interactionType === interactionTypes.SEARCHING_ORIGIN,
  });

  const currentLocationCardClasses = classNames({
    'current-location-card-hide': props.interactionType !== interactionTypes.SEARCHING_ORIGIN,
    'current-location-card-show': props.interactionType === interactionTypes.SEARCHING_ORIGIN,
  });

  const searchResultsCardClasses = classNames({
    'search-results-card-only': props.interactionType === interactionTypes.SEARCHING_DESTINATION,
    'search-results-card': props.interactionType === interactionTypes.SEARCHING_ORIGIN,
  });

  const destinationSearchResultClasses = classNames({
    'search-result-destination-hide': props.interactionType !== interactionTypes.SEARCHING_DESTINATION,
  });

  const originSearchResultClasses = classNames({
    'search-result-origin-hide': props.interactionType !== interactionTypes.SEARCHING_ORIGIN,
  });

  const selectingRouteToolbarClasses = classNames({
    'selecting-route-toolbar-hide': props.interactionType !== interactionTypes.SELECTING_ROUTE,
    'selecting-route-toolbar-show': props.interactionType === interactionTypes.SELECTING_ROUTE,
  });

  const sendToGoogleMapsButtonClasses = classNames({
    'floating-action-button-hide': props.interactionType !== interactionTypes.SELECTING_ROUTE,
    'floating-action-button-show': props.interactionType === interactionTypes.SELECTING_ROUTE,
  });

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
        onClick={() => { props.changeInteractionType(interactionTypes.SEARCHING_ORIGIN); }}
      >
        <ToolbarGroup className="search-toolbargroup">
          <OriginIcon />
          <TextField
            fullWidth
            hintText="Origin"
            value={appHelper.displayCurrentOrigin(props)}
            onClick={() => { props.changeInteractionType(interactionTypes.SEARCHING_ORIGIN); }}
            style={searchBarStyle}
          />
        </ToolbarGroup>
      </Toolbar>
      <Toolbar
        className={selectingRouteToolbarClasses}
        onClick={() => { props.changeInteractionType(interactionTypes.SEARCHING_DESTINATION); }}
      >
        <ToolbarGroup className="search-toolbargroup">
          <DestinationIcon />
          <TextField
            fullWidth
            hintText="Destination"
            value={props.destination}
            onClick={() => {
              props.changeInteractionType(interactionTypes.SEARCHING_DESTINATION);
            }}
            style={searchBarStyle}
          />
        </ToolbarGroup>
      </Toolbar>
      <div className="map-container" style={mapContainerStyle}>
        <Map
          className="map"
          google={window.google}
          onReady={() => (props.changeCurrentLocation(props.dispatch))}
          onDragend={''} // this.setDestination
          onClick={''} // this.setDestination
          style={mapStyle}
        >
          <Marker
            key={'currentLocation'}
            google={window.google}
            position={props.currentLocation}
            icon={{
              url: './bluedot.png',
              scaledSize: new window.google.maps.Size(35, 35),
            }}
            optimized={false}
          />
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
        <ToolbarGroup className="search-toolbargroup">
          <AutoComplete
            fullWidth
            hintText={appHelper.getSearchBarHintText(props, interactionTypes)}
            dataSource={[null]}
            onClick={() => { appHelper.openSearchCards(props, interactionTypes); }}
            onNewRequest={() => { appHelper.searchBarSubmitHandler(props, interactionTypes); }}
            onUpdateInput={(query) => { appHelper.getGoogleMapsPlacePredictions(query, props, interactionTypes); }}
            searchText={appHelper.autofillSearchBar(props, interactionTypes)}
            style={searchBarStyle}
          />
        </ToolbarGroup>
      </Toolbar>
      <Card
        className={`${searchCardsClasses} ${currentLocationCardClasses}`}
      >
        <List>
          <ListItem
            leftIcon={<OriginIcon />}
            primaryText="Use current location"
            onClick={() => { appHelper.useCurrentLocationClickHandler(props, interactionTypes); }}
          />
        </List>
      </Card>
      <Card
        className={`${searchCardsClasses} ${searchResultsCardClasses}`}
        onClick={() => { props.changeInteractionType(interactionTypes.SELECTING_ROUTE); }}
      >
        <List id="search-results">
          {props.destinationSearchResults.map(result => (
            <ListItem
              className={destinationSearchResultClasses}
              leftIcon={<DestinationIcon />}
              primaryText={result}
              onClick={(e) => { props.changeDestination(e.target.textContent); }}
            />
          ))}
          {props.originSearchResults.map(result => (
            <ListItem
              className={originSearchResultClasses}
              leftIcon={<DestinationIcon />}
              primaryText={result}
              onClick={(e) => { props.changeOrigin(e.target.textContent); }}
            />
          ))}
        </List>
      </Card>
      <FloatingActionButton className={sendToGoogleMapsButtonClasses}>
        <MapsNavigation />
      </FloatingActionButton>
    </div>
  );
};

App.propTypes = {
  changeDestination: React.PropTypes.func.isRequired,
  changeInteractionType: React.PropTypes.func.isRequired,
  changeOrigin: React.PropTypes.func.isRequired,
  changeRoute: React.PropTypes.func.isRequired,
  changeRouteResponse: React.PropTypes.func.isRequired,
  currentLocation: React.PropTypes.shape({
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
  }),
  destination: React.PropTypes.shape({
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
  }),
  interactionType: React.PropTypes.string.isRequired,
  origin: React.PropTypes.shape({
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
  }),
  destinationSearchResults: React.PropTypes.array.isRequired, // eslint-disable-line
  originSearchResults: React.PropTypes.array.isRequired, // eslint-disable-line
};

export default App;
