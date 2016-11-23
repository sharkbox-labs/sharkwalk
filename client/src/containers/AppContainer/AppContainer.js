import { connect } from 'react-redux';
import { setDestination, setOrigin, setInteractionType, setCurrentRoute, setRouteResponse } from '../../actions/index';
import App from '../../components/App/App';


const mapStateToProps = state => ({
  currentLocation: state.currentLocation,
  destination: state.destination,
  origin: state.origin,
  interactionType: state.interactionType,
  currentRoute: state.currentRoute,
  routeResponse: state.routeResponse,
});

const mapDispatchToProps = dispatch => ({
  onDestinationChangeEvent: (destination) => {
    dispatch(setDestination(destination));
  },

  onOriginChangeEvent: (origin) => {
    dispatch(setOrigin(origin));
  },

  onInteractionTypeChangeEvent: (interactionType) => {
    dispatch(setInteractionType(interactionType));
  },

  onRouteChangeEvent: (routeIndex) => {
    dispatch(setCurrentRoute(routeIndex));
  },

  onRouteResponse: (routeResponse) => {
    dispatch(setRouteResponse(routeResponse));
  },
});


const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

export default AppContainer;
