const autofillSearchBar = (props, interactionTypes) => {
  // If just viewing map, search bar should be empty
  if (props.interactionType === interactionTypes.VIEWING_MAP) {
    return '';
  }

  // If searching for origin and origin has already been set once
  if (props.interactionType === interactionTypes.SEARCHING_ORIGIN && props.origin) {
    // Check if origin is the name of a place or a geolocation object
    return props.origin.name ? props.origin.name : 'Current Location';
  }

  // If neither of the above, user is searching for destination so autofill with current destination
  return props.destination.name;
};

const displayCurrentOrigin = props => (
  props.origin.name ? props.origin.name : 'Current Location'
);

const convertPlaceIdToLatLng = place => (
  new Promise((resolve, reject) => {
    const placesService = new window.google.maps.places.PlacesService(document.createElement('div'));

    placesService.getDetails(place, (response, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        reject(place, status);
      }

      const newPlaceObj = {
        name: place.name,
        lat: response.geometry.location.lat(),
        lng: response.geometry.location.lng(),
      };

      resolve(newPlaceObj);
    });
  })
  .then(geolocatedPlace => geolocatedPlace)
  .catch((placeObject, status) => {
    throw new Error(`Failed to retrieve lat/lng for '${placeObject.name}'. Response status: ${status}`);
  })
);

const saveSearchResults = (predictions, status, props, interactionTypes) => {
  // Save only name and placeId of places
  const results = predictions.map(prediction => ({
    name: prediction.description,
    placeId: prediction.place_id,
  }));

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

  const autocompleteService = new window.google.maps.places.AutocompleteService();
  return autocompleteService.getPlacePredictions(
    { input: query, bounds: defaultBounds },
    (predictions, status) => {
      saveSearchResults(predictions, status, props, interactionTypes);
    },
  );
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
    convertPlaceIdToLatLng(props.originSearchResults[0]).then((geolocatedPlace) => {
      props.changeOrigin(geolocatedPlace);
    });
  }

  if (props.interactionType === interactionTypes.SEARCHING_DESTINATION) {
    setOriginIfUndefined(props);

    // On user submit from input field, set top result as the destination if the
    // user did not select from the search results.
    convertPlaceIdToLatLng(props.destinationSearchResults[0]).then((geolocatedPlace) => {
      props.changeDestination(geolocatedPlace);
    });
  }

  props.changeInteractionType(interactionTypes.SELECTING_ROUTE);
};

const toggleFloatingActionButtonClass = (interactionType, interactionTypes) => (
  interactionType === interactionTypes.SELECTING_ROUTE ? 'floating-action-button-show' : 'floating-action-button-hide'
);

const toggleInteractionTypeFromMenuClick = (props, interactionTypes) => {
  // If sidebar is currently not open, open sidebar
  if (props.interactionType !== interactionTypes.VIEWING_SIDEBAR) {
    return props.changeInteractionType(interactionTypes.VIEWING_SIDEBAR);
  }

  // If origin and destination has been set, transition to SELECTING_ROUTE view from sidebar
  if (props.interactionType === interactionTypes.VIEWING_SIDEBAR && props.origin && props.destination) {
    return props.changeInteractionType(interactionTypes.SELECTING_ROUTE);
  }

  // If none of the above, go back to VIEWING_MAP
  return props.changeInteractionType(interactionTypes.VIEWING_MAP);
};

const useCurrentLocationClickHandler = (props, interactionTypes) => {
  props.changeOrigin(props.currentLocation);
  props.changeInteractionType(interactionTypes.SELECTING_ROUTE);
};

export default {
  autofillSearchBar,
  displayCurrentOrigin,
  convertPlaceIdToLatLng,
  getGoogleMapsPlacePredictions,
  getSearchBarHintText,
  openSearchCards,
  setOriginIfUndefined,
  searchBarSubmitHandler,
  toggleFloatingActionButtonClass,
  toggleInteractionTypeFromMenuClick,
  useCurrentLocationClickHandler,
};
