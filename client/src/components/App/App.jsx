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

  const googleMapsSearch = (query) => {
    if (query === '') {
      // If the search field was cleared out by the user,
      // reset search results to empty array
      return props.changeDestinationSearchResults([]);
    }

    const mapSuggestions = (predictions, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        // If no search results were returned, reset search results to empty array
        return props.changeDestinationSearchResults([]);
      }

      const results = predictions.map(prediction => prediction.description);

      return props.changeDestinationSearchResults(results);
    };


    const service = new window.google.maps.places.AutocompleteService();
    return service.getPlacePredictions({ input: query, bounds: defaultBounds }, mapSuggestions);
  };


  const searchBarSubmitHandler = () => {
    // set either origin or destination to top result
    if (props.interactionType === interactionTypes.SEARCHING_ORIGIN) {
      // On user submit from field, set top result as the origin if the
      // user did not select from the search results.
      props.changeOrigin(props.dispatch, props.destinationSearchResults[0]);
    }

    if (props.interactionType === interactionTypes.SEARCHING_DESTINATION) {
      // On user submit from field, set top result as the destination if the
      // user did not select from the search results.
      props.changeDestination(props.destinationSearchResults[0]);
    }

    props.changeInteractionType(interactionTypes.SELECTING_ROUTE);
  };

  const currentLocationClickHandler = () => {
    props.changeOrigin(props.dispatch);
    props.changeInteractionType(interactionTypes.SELECTING_ROUTE);
  };

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
            value={typeof props.origin === 'string' ? props.origin : 'Current Location'}
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
        <ToolbarGroup className="search-toolbargroup">
          <AutoComplete
            fullWidth
            hintText={props.interactionType === interactionTypes.SEARCHING_ORIGIN ? 'Search for starting point' : 'Search for destination'}
            dataSource={[null]}
            onClick={() => {
              if (props.interactionType !== interactionTypes.SEARCHING_ORIGIN &&
                props.interactionType !== interactionTypes.SEARCHING_DESTINATION
              ) {
                props.changeInteractionType(interactionTypes.SEARCHING_DESTINATION);
              }
            }}
            onNewRequest={searchBarSubmitHandler}
            onUpdateInput={googleMapsSearch}
            searchText={props.interactionType === interactionTypes.SEARCHING_ORIGIN && props.origin ? 
              typeof props.origin === 'string' ? props.origin : 'Current Location'
              : props.destination
            }
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
            onClick={currentLocationClickHandler}
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
              leftIcon={<DestinationIcon />}
              primaryText={result}
              onClick={(e) => {
                if (props.interactionType === interactionTypes.SEARCHING_ORIGIN) {
                  props.changeOrigin(props.dispatch, e.target.textContent);
                } else {
                  props.changeDestination(e.target.textContent);
                }
              }}
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
  destinationSearchResults: React.PropTypes.array.isRequired, // eslint-disable-line
};

export default App;
