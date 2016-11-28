import { connect } from 'react-redux';
import { setDestination, setOrigin, setInteractionType, setCurrentRoute, setRouteResponse, setDestinationSearchResults } from '../../actions/index';
import App from '../../components/App/App';


const mapStateToProps = state => ({
  currentLocation: state.currentLocation,
  destination: state.destination,
  origin: state.origin,
  interactionType: state.interactionType,
  currentRoute: state.currentRoute,
  routeResponse: state.routeResponse,
  destinationSearchResults: state.destinationSearchResults,
});

const mapDispatchToProps = dispatch => ({
  dispatch,

  changeDestination: (destination) => {
    dispatch(setDestination(destination));
  },

  changeInteractionType: (interactionType) => {
    dispatch(setInteractionType(interactionType));
  },

  changeOrigin: (dispatchFunction, origin) => {
    // Dispatch is handled by thunk middleware (see setOrigin action creator)
    setOrigin(dispatchFunction, origin);
  },

  changeRoute: (routeIndex) => {
    dispatch(setCurrentRoute(routeIndex));
  },

  changeRouteResponse: (routeResponse) => {
    // Dispatch is handled by thunk middleware (see setRouteResponse action creator)
    setRouteResponse(routeResponse);
  },

  changeDestinationSearchResults: (results) => {
    dispatch(setDestinationSearchResults(results));
  },
});

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export default AppContainer;
