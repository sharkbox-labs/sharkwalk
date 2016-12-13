const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_LOCATION':
      return Object.assign({}, state, { currentLocation: action.currentLocation });

    case 'SET_CURRENT_ROUTE':
      return Object.assign({}, state, { currentRouteIndex: action.routeIndex });

    case 'SET_DESTINATION':
      return Object.assign({}, state, { destination: action.destination });

    case 'SET_DESTINATION_SEARCH_RESULTS':
      return Object.assign({}, state, { destinationSearchResults: action.destinationSearchResults }); // eslint-disable-line

    case 'SET_INTERACTION_TYPE':
      return Object.assign({}, state, { interactionType: action.interactionType });

    case 'SET_IS_FETCHING_ROUTE_DATA':
      return Object.assign({}, state, { isFetchingRouteData: action.isFetchingRouteData });

    case 'SET_ORIGIN':
      return Object.assign({}, state, { origin: action.origin });

    case 'SET_ORIGIN_SEARCH_RESULTS':
      return Object.assign({}, state, { originSearchResults: action.originSearchResults });

    case 'SET_ROUTE_RESPONSE':
      return Object.assign({}, state, { routeResponse: action.routeResponse });

    default:
      return state;
  }
};

export default reducer;
