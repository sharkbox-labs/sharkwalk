const autofillSearchBar = (props, interactionTypes) => {
  // If just viewing map, search bar should be empty
  if (props.interactionType === interactionTypes.VIEWING_MAP) {
    return '';
  }

  // If searching for origin and origin has already been set once
  if (props.interactionType === interactionTypes.SEARCHING_ORIGIN && props.origin) {
    // Check if origin is the name of a place or a geolocation object
    return typeof props.origin === 'string' ? props.origin : 'Current Location';
  }

  // If neither of the above, user is searching for destination so autofill with current destination
  return props.destination;
};

const displayCurrentOrigin = props => (
  typeof props.origin === 'string' ? props.origin : 'Current Location'
);

const getGoogleMapsPlacePredictions = (query, props, interactionTypes) => {
  // Prioritize San Francisco places during search
  const defaultBounds = new window.google.maps.LatLngBounds(
    new window.google.maps.LatLng(37.7000, -122.5200),
    new window.google.maps.LatLng(37.8100, -122.3500),
  );

  // Reset search results to empty array if search field was cleared out by user
  if (query === '' && props.interactionType === interactionTypes.SEARCHING_ORIGIN) {
    return props.changeOriginSearchResults([]);
  }

  if (query === '' && props.interactionType === interactionTypes.SEARCHING_DESTINATION) {
    return props.changeDestinationSearchResults([]);
  }

  const mapSuggestions = (predictions, status) => {
    // Get only names of places
    const results = predictions.map(prediction => prediction.description);

    // If query returned no results from Google Maps Places, reset search results to empty array
    if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
      if (props.interactionType === interactionTypes.SEARCHING_ORIGIN) {
        return props.changeOriginSearchResults([]);
      }

      return props.changeDestinationSearchResults([]);
    }

    // If currently searching for origin, save results to origin results state
    if (props.interactionType === interactionTypes.SEARCHING_ORIGIN) {
      return props.changeOriginSearchResults(results);
    }

    // Save results to destination results state
    return props.changeDestinationSearchResults(results);
  };

  const service = new window.google.maps.places.AutocompleteService();
  return service.getPlacePredictions({ input: query, bounds: defaultBounds }, mapSuggestions);
};

const getSearchBarHintText = (props, interactionTypes) => (
  props.interactionType === interactionTypes.SEARCHING_ORIGIN ? 'Search for starting point' : 'Search for destination'
);

const openSearchCards = (props, interactionTypes) => {
  if (props.interactionType !== interactionTypes.SEARCHING_ORIGIN &&
    props.interactionType !== interactionTypes.SEARCHING_DESTINATION
  ) {
    props.changeInteractionType(interactionTypes.SEARCHING_DESTINATION);
  }
};

const setOriginIfUndefined = (props) => {
  // If origin hasn't been set, use currentLocation.
  if (props.origin === ' ') {
    props.changeOrigin(props.currentLocation);
  }
};

const searchBarSubmitHandler = (props, interactionTypes) => {
  if (props.interactionType === interactionTypes.SEARCHING_ORIGIN) {
    // On user submit from input field, set top result as the origin if the
    // user did not select from the search results.
    props.changeOrigin(props.originSearchResults[0]);
  }

  if (props.interactionType === interactionTypes.SEARCHING_DESTINATION) {
    setOriginIfUndefined(props);

    // On user submit from input field, set top result as the destination if the
    // user did not select from the search results.
    props.changeDestination(props.destinationSearchResults[0]);
  }

  props.changeInteractionType(interactionTypes.SELECTING_ROUTE);
};

const toggleFloatingActionButtonClass = (interactionType, interactionTypes) => (
  interactionType === interactionTypes.SELECTING_ROUTE ? 'floating-action-button-show' : 'floating-action-button-hide'
);

const toggleInteractionTypeFromMenuClick = (currentInteractionType, dispatcher, interactionTypes) => {
  if (currentInteractionType !== interactionTypes.VIEWING_SIDEBAR) {
    dispatcher(interactionTypes.VIEWING_SIDEBAR);
  }

  if (currentInteractionType === interactionTypes.VIEWING_SIDEBAR) {
    dispatcher(interactionTypes.VIEWING_MAP);
  }
};

const useCurrentLocationClickHandler = (props, interactionTypes) => {
  props.changeOrigin(props.currentLocation);
  props.changeInteractionType(interactionTypes.SELECTING_ROUTE);
};

export default {
  autofillSearchBar,
  displayCurrentOrigin,
  getGoogleMapsPlacePredictions,
  getSearchBarHintText,
  openSearchCards,
  setOriginIfUndefined,
  searchBarSubmitHandler,
  toggleFloatingActionButtonClass,
  toggleInteractionTypeFromMenuClick,
  useCurrentLocationClickHandler,
};
