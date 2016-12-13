import { connect } from 'react-redux';
import { setCurrentLocation, setDestination, setIsFetchingRouteData, setOrigin, setInteractionType, setCurrentRoute, setRouteResponse, setDestinationSearchResults, setOriginSearchResults } from '../../actions/index';
import App from '../../components/App/App';


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

  changeRouteResponse: (origin, destination, dispatchFunction, errorHandler) => {
    // Dispatch is handled in action creator
    // setRouteResponse(origin, destination)(dispatch);
    setRouteResponse(origin, destination, dispatchFunction, errorHandler);
  },

  changeDestinationSearchResults: (destinationResults) => {
    dispatch(setDestinationSearchResults(destinationResults));
  },

  changeOriginSearchResults: (originResults) => {
    dispatch(setOriginSearchResults(originResults));
  },
});

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export default AppContainer;
