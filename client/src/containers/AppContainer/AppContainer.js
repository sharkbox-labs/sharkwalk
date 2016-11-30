import { connect } from 'react-redux';
import { setCurrentLocation, setDestination, setOrigin, setInteractionType, setCurrentRoute, setRouteResponse, setDestinationSearchResults, setOriginSearchResults } from '../../actions/index';
import App from '../../components/App/App';


const mapStateToProps = state => ({
  currentLocation: state.currentLocation,
  destination: state.destination,
  origin: state.origin,
  interactionType: state.interactionType,
  currentRoute: state.currentRoute,
  routeResponse: state.routeResponse,
  destinationSearchResults: state.destinationSearchResults,
  originSearchResults: state.originSearchResults,
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

  changeInteractionType: (interactionType) => {
    dispatch(setInteractionType(interactionType));
  },

  changeOrigin: (origin) => {
    dispatch(setOrigin(origin));
  },

  changeRoute: (routeIndex) => {
    dispatch(setCurrentRoute(routeIndex));
  },

  changeRouteResponse: (origin, destination) => {
    // Dispatch is handled in action creator
    setRouteResponse(origin, destination);
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
