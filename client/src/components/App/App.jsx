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
  let searchResultFirstCard = null;
  let searchResultSecondCard = null;

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
    // display: 'none',
  };
  const searchToolbarGroupStyle = {
    width: '100%',
    // display: 'none',
  };
  const selectingRouteToolbarStyle = {
    position: 'relative',
    backgroundColor: 'rgb(0, 188, 212)',
    // display: 'none',
  };
  const iconButtonStyle = {
    float: 'left',
  };
  const searchBarStyle = {};
  // const firstCardStyle = {
  //   position: 'absolute',
  //   left: '5%',
  //   right: '5%',
  //   top: '11%',
  //   borderRadius: '3px',
  // };
  // const secondCardStyle = {
  //   position: 'absolute',
  //   left: '5%',
  //   right: '5%',
  //   top: '25%',
  //   bottom: '0%',
  //   borderRadius: '3px',
  // };

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

  const searchResultsCardsClasses = classNames({
    'search-results-hide': props.interactionType !== interactionTypes.SEARCHING_DESTINATION && props.interactionType !== interactionTypes.SEARCHING_ORIGIN,
    'search-results-show': props.interactionType === interactionTypes.SEARCHING_DESTINATION || props.interactionType === interactionTypes.SEARCHING_ORIGIN,
  });

  return (
    <div className="app-container" style={appContainerStyle} >
      <Drawer
        docked={false}
        width={300}
        open={props.interactionType === interactionTypes.VIEWING_SIDEBAR}
      />
      <Toolbar style={selectingRouteToolbarStyle}>
        <ToolbarGroup style={searchToolbarGroupStyle}>
          <OriginIcon />
          <AutoComplete
            hintText="Origin"
            fullWidth
            dataSource={['INSERT_DATA_HERE']}
            style={searchBarStyle}
          />
        </ToolbarGroup>
      </Toolbar>
      <Toolbar style={selectingRouteToolbarStyle}>
        <ToolbarGroup style={searchToolbarGroupStyle}>
          <DestinationIcon />
          <AutoComplete
            hintText="Destination"
            fullWidth
            dataSource={['INSERT_DATA_HERE']}
            style={searchBarStyle}
          />
        </ToolbarGroup>
      </Toolbar>
      <div className="map-container" style={mapContainerStyle}>
        <Map
          className="map"
          google={window.google} // eslint-disable-line
          onReady={() => (
            props.changeOrigin(props.dispatch)
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
            onClick={() => {
              props.changeInteractionType('SEARCHING_DESTINATION');
            }}
          />
        </ToolbarGroup>
      </Toolbar>


      <Card className={`${searchResultsCardsClasses} first-card`} ref={(c) => { searchResultFirstCard = c; }}>
        <CardHeader
          title="URL Avatar"
          subtitle="Subtitle"
          avatar="images/jsa-128.jpg"
        />
      </Card>

      <Card className={`${searchResultsCardsClasses} second-card`} ref={(c) => { searchResultSecondCard = c; }}>
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
