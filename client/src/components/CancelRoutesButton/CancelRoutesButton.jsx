import React from 'react';
import { connect } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Clear from 'material-ui/svg-icons/content/clear';
import { setCurrentLocation, setDestination, setIsFetchingRouteData, setOrigin, setInteractionType, setCurrentRoute, setRouteResponse, setDestinationSearchResults, setOriginSearchResults } from '../../actions/index';

const mapStateToProps = state => ({
  currentLocation: state.currentLocation,
  currentRouteIndex: state.currentRouteIndex,
  destination: state.destination,
  destinationSearchResults: state.destinationSearchResults,
  interactionType: state.interactionType,
  isFetchingRouteData: state.isFetchingRouteData,
  origin: state.origin,
  originSearchResults: state.originSearchResults,
  routeResponse: state.routeResponse,
});

const mapDispatchToProps = dispatch => ({
  dispatch,

  changeCurrentLocation: (dispatchFunction) => {
    // Dispatch is handled in action creator
    setCurrentLocation(dispatchFunction);
  },

  changeDestination: (destination) => {
    dispatch(setDestination(destination));
  },

  changeIsFetchingRouteData: (isFetchingRouteData) => {
    dispatch(setIsFetchingRouteData(isFetchingRouteData));
  },

  changeInteractionType: (interactionType) => {
    dispatch(setInteractionType(interactionType));
  },

  changeOrigin: (origin) => {
    dispatch(setOrigin(origin));
  },

  changeRoute: (routeIndex) => {
    dispatch(setCurrentRoute(routeIndex));
  },

  changeRouteResponse: (origin, destination, dispatchFunction) => {
    // Dispatch is handled in action creator
    // setRouteResponse(origin, destination)(dispatch);
    setRouteResponse(origin, destination, dispatchFunction);
  },

  changeDestinationSearchResults: (destinationResults) => {
    dispatch(setDestinationSearchResults(destinationResults));
  },

  changeOriginSearchResults: (originResults) => {
    dispatch(setOriginSearchResults(originResults));
  },
});

const containerStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
};

const buttonStyle = {
  position: 'absolute',
  bottom: 45,
  left: 45,
};

class CancelRoutesButton extends React.Component {
  componentWillMount() {
    this.cancelRouting = this.cancelRouting.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.interactionType !== this.props.interactionType) {
      return true;
    }
    if (nextProps.isFetchingRouteData !== this.props.isFetchingRouteData) {
      return true;
    }
    return false;
  }

  cancelRouting() {
    this.props.changeOrigin({
      lat: 400,
      lng: 400,
    });
    this.props.changeDestination({
      lat: 400,
      lng: 400,
    });

    this.props.changeDestinationSearchResults([]);
    this.props.changeOriginSearchResults([]);
    this.props.dispatch({
      type: 'SET_ROUTE_RESPONSE',
      routeResponse:
      [{
        risks: [],
        maxRisk: 0,
        averageRisk: 0,
        riskWeight: 0,
        distance: 0,
        duration: 0,
        googleMapsUrl: '',
        path: [],
      },
      {
        risks: [],
        maxRisk: 0,
        averageRisk: 0,
        riskWeight: 0,
        distance: 0,
        duration: 0,
        googleMapsUrl: '',
        path: [],
      },
      {
        risks: [],
        maxRisk: 0,
        averageRisk: 0,
        riskWeight: 0,
        distance: 0,
        duration: 0,
        googleMapsUrl: '',
        path: [],
      }],
    });
    this.props.changeInteractionType('VIEWING_MAP');
    this.props.changeRoute(0);
  }

  render() {
    if (this.props.interactionType === 'SELECTING_ROUTE' && !this.props.isFetchingRouteData) {
      return (
        <div className="app-container" style={containerStyle} >
          <FloatingActionButton
            className="clearButton"
            onClick={this.cancelRouting}
            style={buttonStyle}
            mini
            backgroundColor={'rgb(200,8,8)'}

          >
            <Clear className="clear-icon" />
          </FloatingActionButton>
        </div>
      );
    } else {
      return null;
    }
  }
}

CancelRoutesButton.propTypes = {
};

const CancelRoutesButtonWrapped = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CancelRoutesButton);

export default CancelRoutesButtonWrapped;

