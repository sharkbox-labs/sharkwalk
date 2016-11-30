const autofillSearchBar = (props, interactionTypes) => {
  // If just viewing map, search bar should be empty
  if (props.interactionType === interactionTypes.VIEWING_MAP) {
    return '';
  }

  // If searching for origin and origin has been set
  if (props.interactionType === interactionTypes.SEARCHING_ORIGIN && props.origin) {
    // Show current origin
    return props.origin.name;
  }

  // If neither of the above, user is searching for destination so autofill with current destination
  return props.destination.name;
};

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

const getCurrentLocationCardPrimaryText = props => (
  props.currentLocation !== ' ' ? 'Use current location' : 'Current location not available'
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
  if (props.origin === ' ' && props.currentLocation.lat && props.currentLocation.lng) {
    props.changeOrigin(Object.assign({}, props.currentLocation, { name: 'Current Location' }));
  }
};

const getDirections = (props, interactionTypes, place) => {
  if (props.interactionType === interactionTypes.SEARCHING_ORIGIN) {
    // On user submit from input field, set top matched origin search result as the origin
    convertPlaceIdToLatLng(place || props.originSearchResults[0]).then((geolocatedPlace) => {
      props.changeOrigin(geolocatedPlace);
      props.changeRouteResponse(geolocatedPlace, props.destination);
    });
  }

  if (props.interactionType === interactionTypes.SEARCHING_DESTINATION) {
    // If origin hasn't been set before, set origin
    setOriginIfUndefined(props);

    // On user submit from input field, set top matched destination search result as the destination
    convertPlaceIdToLatLng(place || props.destinationSearchResults[0]).then((geolocatedPlace) => {
      props.changeDestination(geolocatedPlace);

      // Use current location as origin if origin hasn't been set yet
      if (!props.origin.lat) {
        props.changeRouteResponse(props.currentLocation, geolocatedPlace);
      } else {
        props.changeRouteResponse(props.origin, geolocatedPlace);
      }
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
  if (props.currentLocation.lat && props.currentLocation.lng) {
    props.changeOrigin(Object.assign({}, props.currentLocation, { name: 'Current Location' }));
  }
  props.changeInteractionType(interactionTypes.SELECTING_ROUTE);
};

export default {
  autofillSearchBar,
  convertPlaceIdToLatLng,
  getCurrentLocationCardPrimaryText,
  getDirections,
  getGoogleMapsPlacePredictions,
  getSearchBarHintText,
  openSearchCards,
  setOriginIfUndefined,
  toggleFloatingActionButtonClass,
  toggleInteractionTypeFromMenuClick,
  useCurrentLocationClickHandler,
};
