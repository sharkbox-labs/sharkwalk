import React from 'react';
import classNames from 'classnames';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import Card from 'material-ui/Card';
import Divider from 'material-ui/Divider';
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
import Directions from 'material-ui/svg-icons/maps/directions';
import Close from 'material-ui/svg-icons/navigation/close';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import './App.css';
import RiskPath from '../RiskPath/RiskPath';
import InfoWindow from '../InfoWindow/InfoWindow';
import appHelper from '../utils/appHelper';
import CancelRoutesButton from '../CancelRoutesButton/CancelRoutesButton';
import FlashMessage from '../FlashMessage/FlashMessage';


injectTapEventPlugin();

const App = (props) => {
  // Create immutable interaction types for components to use
  const interactionTypes = {
    VIEWING_MAP: 'VIEWING_MAP',
    SEARCHING_ORIGIN: 'SEARCHING_ORIGIN',
    SEARCHING_DESTINATION: 'SEARCHING_DESTINATION',
    SELECTING_ROUTE: 'SELECTING_ROUTE',
    VIEWING_SIDEBAR: 'VIEWING_SIDEBAR',
  };

  // These styles are for development only, remove for production
  const mapStyle = props.interactionType === interactionTypes.SELECTING_ROUTE ? { height: 'calc(100% - 112px)' } : {};
  const appContainerStyle = {};
  const mapContainerStyle = {};
  const searchBarStyle = {};
  const textFieldInputStyle = {
    color: 'rgb(224,247,250)',
    backgroundColor: 'rgb(77,208,225)',
    borderRadius: '5px',
    'box-sizing': 'border-box',
    paddingLeft: '10px',
    paddingRight: '10px',
    height: '80%',
    width: '100%',
  };

  const mapClasses = classNames({
    'map-viewing': props.interactionType !== interactionTypes.SELECTING_ROUTE,
    'map-selecting-route': props.interactionType === interactionTypes.SELECTING_ROUTE,
  });

  const searchBarToolbarClasses = classNames({
    'search-toolbar-hide': props.interactionType === interactionTypes.SELECTING_ROUTE ||
                           props.interactionType === interactionTypes.VIEWING_SIDEBAR,
    'search-toolbar-show': props.interactionType !== interactionTypes.SELECTING_ROUTE &&
                           props.interactionType !== interactionTypes.VIEWING_SIDEBAR,
  });

  const originTextFieldClasses = classNames({
    'origin-not-available': props.origin.lat === 400 && props.currentLocation.lat === 400,
    'origin-available': props.origin.lat !== 400 || props.currentLocation.lat !== 400,
  });

  const destinationTextFieldClasses = classNames({
    'destination-not-available': props.destination.lat === 400,
    'destination-available': props.destination.lat !== 400,
  });

  const searchCardsClasses = classNames({
    'search-cards-hide': props.interactionType !== interactionTypes.SEARCHING_DESTINATION &&
                         props.interactionType !== interactionTypes.SEARCHING_ORIGIN,
    'search-cards-show': (props.interactionType === interactionTypes.SEARCHING_DESTINATION &&
                          props.destinationSearchResults.length > 0) ||
                         (props.interactionType === interactionTypes.SEARCHING_ORIGIN &&
                          props.originSearchResults.length > 0),
  });

  const currentLocationCardClasses = classNames({
    'current-location-card-hide': props.interactionType !== interactionTypes.SEARCHING_ORIGIN,
    'current-location-card-show': props.interactionType === interactionTypes.SEARCHING_ORIGIN,
  });

  const useCurrentLocationListItemClassNames = classNames({
    'current-location-found': props.currentLocation.lat && props.currentLocation.lng,
    'current-location-not-found': props.currentLocation.lat === 400 && props.currentLocation.lng === 400,
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
    'floating-action-button-hide': props.interactionType !== interactionTypes.SELECTING_ROUTE || props.routeResponse[0].risks.length === 0,
    'floating-action-button-show': props.routeResponse[0].risks.length !== 0 && props.interactionType === interactionTypes.SELECTING_ROUTE,
  });

  let flashMessage;

  const directionErrorHandler = (error) => {
    // getting the response of a bad request
    if (error.data.error.code === 'NO_COVERAGE') {
      flashMessage.flashText('Sorry brah... Shark Walk currently only supports directions in San Francisco', 5);
    } else {
      flashMessage.flashText('Bummer dude... There was an error getting your directions', 5);
    }
  };

  return (
    <div className="app-container" style={appContainerStyle} >
      <Drawer
        docked={false}
        width={300}
        open={props.interactionType === interactionTypes.VIEWING_SIDEBAR}
      >
        <IconButton
          className="searchbar-menu-button"
          onClick={() => (
            appHelper.toggleInteractionTypeFromMenuClick(props, interactionTypes)
          )}
        >
          <Close color="rgb(0, 188, 212)" />
        </IconButton>
        <div className="shark-walk-about-container" >
          <h1> <img
            className={'shark-image'}
            alt={'shark walk'}
            src={'./shark.gif'}
            width={66}
          /> Shark Walk </h1>
          <h2> Find the Safe Wave There </h2>
          <p>Shark Walk carefully calculates walking routes using up-to-date San Francisco crime data.
            Routes are represented by a risk gradient, letting you know where the waters are mellow
            and where to tread more carefully.
            Once you have selected your route, click the provided link for walking directions. </p>
        </div>
        <FlatButton label="Fork Me On GitHub" className="flat-button" href="https://github.com/sharkbox-labs/sharkwalk" />
      </Drawer>
      <Toolbar
        className={`${selectingRouteToolbarClasses} current-origin`}
        onClick={() => { props.changeInteractionType(interactionTypes.SEARCHING_ORIGIN); }}
      >
        <ToolbarGroup className={`search-toolbargroup ${originTextFieldClasses}`}>
          <OriginIcon className="selecting-route-toolbar-icon" />
          <TextField
            id="text-field-controlled"
            inputStyle={textFieldInputStyle}
            underlineShow={false}
            fullWidth
            hintText="Origin"
            value={props.origin.name || 'Choose starting point...'}
            onClick={() => { props.changeInteractionType(interactionTypes.SEARCHING_ORIGIN); }}
            style={searchBarStyle}
          />
        </ToolbarGroup>
      </Toolbar>
      <Toolbar
        className={`${selectingRouteToolbarClasses} current-destination`}
        onClick={() => { props.changeInteractionType(interactionTypes.SEARCHING_DESTINATION); }}
      >
        <ToolbarGroup className={`search-toolbargroup ${destinationTextFieldClasses}`}>
          <DestinationIcon className="selecting-route-toolbar-icon" />
          <TextField
            id="text-field-controlled"
            inputStyle={textFieldInputStyle}
            underlineShow={false}
            fullWidth
            hintText="Destination"
            value={props.destination.name || 'Choose destination...'}
            onClick={() => {
              props.changeInteractionType(interactionTypes.SEARCHING_DESTINATION);
            }}
            style={searchBarStyle}
          />
        </ToolbarGroup>
      </Toolbar>
      <div className={mapClasses} style={mapContainerStyle}>
        <Map
          className="map"
          gestureHandling={'greedy'}
          google={window.google}
          onReady={(e) => {
            props.changeCurrentLocation(props.dispatch);
          }}
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
            icon={{ url: './green-marker.png' }}
            key={'origin'}
            position={props.origin}
            google={window.google}
          />
          <Marker
            key={'destination'}
            position={props.destination}
            google={window.google}
          />
          {props.routeResponse.map((route, index) => (
            <RiskPath
              changeRoute={props.changeRoute}
              currentRouteIndex={props.currentRouteIndex}
              destination={props.destination}
              index={index}
              key={index}
              points={route.path}
              risks={route.risks}
              origin={props.origin}
            />
          ))}
          {props.routeResponse.map((route, index) => {
            const alternateRouteIndex = index === 0 ? 1 : 0;
            return (
              <InfoWindow
                className="info-window"
                currentRouteDisplayedIndex={props.currentRouteIndex}
                routeIndex={index}
                route={props.routeResponse[index]}
                alternateRoute={props.routeResponse[alternateRouteIndex]}
              />
            );
          })}
        </Map>
      </div>
      <Toolbar className={searchBarToolbarClasses}>
        <ToolbarGroup firstChild className="toolbar-group">
          <IconButton
            className="searchbar-menu-button"
            onClick={() => (
              appHelper.toggleInteractionTypeFromMenuClick(
                props,
                interactionTypes,
              )
            )}
          >
            <SearchBarHamburgerIcon color="rgb(0, 188, 212)" />
          </IconButton>
        </ToolbarGroup>
        <ToolbarGroup className="search-toolbargroup">
          <AutoComplete
            fullWidth
            hintText={appHelper.getSearchBarHintText(props, interactionTypes)}
            dataSource={[null]}
            onClick={() => { appHelper.openSearchCards(props, interactionTypes); }}
            onNewRequest={() => {
              appHelper.getDirections(props, interactionTypes, null, props.dispatch, directionErrorHandler);
            }}
            onUpdateInput={(query) => {
              appHelper.getGoogleMapsPlacePredictions(query, props, interactionTypes);
            }}
            searchText={appHelper.autofillSearchBar(props, interactionTypes)}
            style={searchBarStyle}
            underlineStyle={{ color: 'rgb(0, 188, 212)' }}
          />
        </ToolbarGroup>
      </Toolbar>
      <Card
        className={`${currentLocationCardClasses}`}
      >
        <List>
          <ListItem
            className={useCurrentLocationListItemClassNames}
            leftIcon={<OriginIcon />}
            primaryText={appHelper.getCurrentLocationCardPrimaryText(props)}
            onClick={() => {
              appHelper.useCurrentLocationClickHandler(props, interactionTypes, props.dispatch, directionErrorHandler);
            }}
          />
        </List>
      </Card>
      <Card
        className={`${searchCardsClasses} ${searchResultsCardClasses}`}
      >
        <List>
          {props.destinationSearchResults.map(result => (
            <div className={destinationSearchResultClasses} key={result.name}>
              <ListItem
                leftIcon={<DestinationIcon />}
                primaryText={result.name}
                onClick={() => {
                  appHelper.getDirections(props, interactionTypes, result, props.dispatch, directionErrorHandler);
                }}
              />
              <Divider />
            </div>
          ))}
          {props.originSearchResults.map(result => (
            <div className={originSearchResultClasses} key={result.name}>
              <ListItem
                leftIcon={<DestinationIcon />}
                primaryText={result.name}
                onClick={() => {
                  appHelper.getDirections(props, interactionTypes, result, props.dispatch, directionErrorHandler);
                }}
              />
              <Divider />
            </div>
          ))}
        </List>
      </Card>
      <FloatingActionButton
        className={sendToGoogleMapsButtonClasses}
        onClick={() => window.open(props.routeResponse[props.currentRouteIndex].googleMapsUrl)}
      >
        <Directions
          className="directions-icon"
          style={{ fill: 'rgb(178,235,242)' }}
        />
      </FloatingActionButton>
      <RefreshIndicator
        className="refresh-indicator"
        left={window.innerWidth - 106}
        size={56}
        status={props.isFetchingRouteData ? 'loading' : 'hide'}
        top={window.innerHeight - 81}
      />
      <CancelRoutesButton
        routeResponse={props.routeResponse}
        interactionType={props.interactionType}
        clickAction={() => {
          appHelper.cancelRouting(props);
        }}
      />
      <FlashMessage
        ref={(x) => { if (!flashMessage) flashMessage = x; }}
      />
    </div>
  );
};

App.propTypes = {
  changeDestination: React.PropTypes.func.isRequired,
  changeInteractionType: React.PropTypes.func.isRequired,
  changeOrigin: React.PropTypes.func.isRequired,
  changeRoute: React.PropTypes.func.isRequired,
  currentRouteIndex: React.PropTypes.number.isRequired,
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
  isFetchingRouteData: React.PropTypes.bool.isRequired,
  origin: React.PropTypes.shape({
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
  }),
  destinationSearchResults: React.PropTypes.array.isRequired, // eslint-disable-line
  originSearchResults: React.PropTypes.array.isRequired, // eslint-disable-line
  routeResponse: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      risks: React.PropTypes.array.isRequired,
      maxRisk: React.PropTypes.number.isRequired,
      averageRisk: React.PropTypes.number.isRequired,
      riskWeight: React.PropTypes.number.isRequired,
      distance: React.PropTypes.number.isRequired,
      duration: React.PropTypes.number.isRequired,
      googleMapsUrl: React.PropTypes.string.isRequired,
      path: React.PropTypes.array.isRequired,
    }),
  ),
};

export default App;
