import axios from 'axios';
import qs from 'qs';

/**
 * Get geolocation and set current location to state
 * @param  {Function} dispatch - The dispatch function to send actions to the reducers.
 */
export const setCurrentLocation = (dispatch) => {
  if ('geolocation' in navigator) {
    const success = (position) => {
      dispatch({
        type: 'SET_CURRENT_LOCATION',
        currentLocation: { lat: position.coords.latitude, lng: position.coords.longitude },
      });
    };

    const failure = (error) => {
      console.warn('ERROR(' + error.code + '): ' + error.message); // eslint-disable-line
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.watchPosition(success, failure, options);
  } else {
    throw new Error('Sorry, no position available.');
  }
};

/**
 * Set destination to state
 * @param  {Object} destination - The destination of the route. Must have keys `lat` and `lng`.
 * @return {Object} action - The `SET_DESTINATION` action.
 */
export const setDestination = destination => ({
  type: 'SET_DESTINATION',
  destination,
});

/**
 * Set origin to state
 * @param  {Object} origin - The origin of the route. Must have keys `lat` and 'lng'.
 * @return {Object} action - The `SET_ORIGIN` action.
 */
export const setOrigin = origin => ({
  type: 'SET_ORIGIN',
  origin,
});

/**
 * Set the interactionType to state
 * @param  {String} interactionType - An enumerable string to determine the UI state.
 * @return {Object} action - The `SET_INTERACTION_TYPE` action.
 */
export const setInteractionType = interactionType => ({
  type: 'SET_INTERACTION_TYPE',
  interactionType,
});

/**
 * Set the routeIndex to state
 * @param  {Number} routeIndex - This is an array index corresponding to a distinct
 * route in the routeResponse object that was fetch from the Integration Server.
 * @return {Object} action - The `SET_CURRENT_ROUTE` action.
 */
export const setCurrentRoute = routeIndex => ({
  type: 'SET_CURRENT_ROUTE',
  routeIndex,
});

/**
 * GET request to Integration Server to retrieve route data
 * @param  {Object} origin - The origin of the route. Must have keys `lat` and 'lng'.
 * @param  {Object} destination - The end point. Must have keys `lat` and `lng`.
 * @return {Function} callback - Using redux-thunk to return a callback that sends
 * out a promisified, async request to the Integration Server.
 */
export const setRouteResponse = (origin, destination) => {
  const serverUrl = /^(development|test)$/.test(process.env.NODE_ENV) ? 'http://localhost:3000' : '';

  const queryString = qs.stringify({
    origin,
    destination,
  });

  const request = axios.get(`${serverUrl}/api/trip?${queryString}`);

  return (dispatch) => {
    request.then(({ data }) => {
      dispatch({
        type: 'SET_ROUTE_RESPONSE',
        routeResponse: data,
      });
    });
  };
};

/**
 * Set the results from a Google Maps Places destination query to state
 * @param  {Array} results - An array of strings that are the names of the places
 * returned from Google Maps Places. (Note: This is not simply the response object
 * received from Google Maps--it has been modified to include only the names.)
 * @return {Object} action - The `SET_DESTINATION_SEARCH_RESULTS` action.
 */
export const setDestinationSearchResults = destinationResults => ({
  type: 'SET_DESTINATION_SEARCH_RESULTS',
  destinationSearchResults: destinationResults,
});

/**
 * Set the results from a Google Maps Places origin query to state
 * @param  {Array} results - An array of strings that are the names of the places
 * returned from Google Maps Places. (Note: This is not simply the response object
 * received from Google Maps--it has been modified to include only the names.)
 * @return {Object} action - The `SET_ORIGIN_SEARCH_RESULTS` action.
 */
export const setOriginSearchResults = originResults => ({
  type: 'SET_ORIGIN_SEARCH_RESULTS',
  originSearchResults: originResults,
});
