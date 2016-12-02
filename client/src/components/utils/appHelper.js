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

const centerMapToOrigin = (props) => {
  console.log('HERE!!!');
  props.map.setCenter(props.position);
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
  // Check that current location has been reset to a real location
  props.currentLocation.lat !== 400 ? 'Use current location' : 'Current location not available'
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

const setOriginToCurrentLocation = (props) => {
  // If origin hasn't been set, save currentLocation (if currentLocation is available) as the origin in store
  if (props.origin.lat === 400 && props.currentLocation.lat !== 400) {
    props.changeOrigin(Object.assign({}, { name: 'Current Location' }, props.currentLocation));
  }
};

const getDirections = (props, interactionTypes, place, dispatchFunction) => {
  if (props.interactionType === interactionTypes.SEARCHING_ORIGIN) {
    // On user submit from input field, set top matched origin search result as the origin
    convertPlaceIdToLatLng(place || props.originSearchResults[0]).then((geolocatedPlace) => {
      props.changeOrigin(geolocatedPlace);
      props.changeRouteResponse(geolocatedPlace, props.destination, dispatchFunction);
    });
  }

  if (props.interactionType === interactionTypes.SEARCHING_DESTINATION) {
    // On user submit from input field, set top matched destination search result as the destination
    convertPlaceIdToLatLng(place || props.destinationSearchResults[0]).then((geolocatedPlace) => {
      props.changeDestination(geolocatedPlace);

      // If origin hasn't been set before, set origin to currentLocation
      if (props.origin.lat === 400) {
        setOriginToCurrentLocation(props);
        props.changeRouteResponse(props.currentLocation, geolocatedPlace, dispatchFunction);
      } else {
        props.changeRouteResponse(props.origin, geolocatedPlace, dispatchFunction);
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
  if (props.interactionType === interactionTypes.VIEWING_SIDEBAR && props.origin.lat !== 400 && props.destination.lat !== 400) {
    return props.changeInteractionType(interactionTypes.SELECTING_ROUTE);
  }

  // If none of the above, go back to VIEWING_MAP
  return props.changeInteractionType(interactionTypes.VIEWING_MAP);
};

const useCurrentLocationClickHandler = (props, interactionTypes, dispatchFunction) => {
  if (props.currentLocation.lat !== 400) {
    const currentLocation = Object.assign({}, { name: 'Current Location' }, props.currentLocation);
    props.changeOrigin(currentLocation);
    props.changeRouteResponse(currentLocation, props.destination, dispatchFunction);
  }

  props.changeInteractionType(interactionTypes.SELECTING_ROUTE);
};


const cancelRouting = (props) => {
  props.changeOrigin({
    lat: 400,
    lng: 400,
  });
  props.changeDestination({
    lat: 400,
    lng: 400,
  });

  props.changeDestinationSearchResults([]);
  props.changeOriginSearchResults([]);
  props.dispatch({
    type: 'SET_ROUTE_RESPONSE',
    routeResponse:
    [
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
    ],
  });
  props.changeInteractionType('VIEWING_MAP');
  props.changeRoute(0);
};

export default {
  autofillSearchBar,
  centerMapToOrigin,
  convertPlaceIdToLatLng,
  getCurrentLocationCardPrimaryText,
  getDirections,
  getGoogleMapsPlacePredictions,
  getSearchBarHintText,
  openSearchCards,
  setOriginToCurrentLocation,
  toggleFloatingActionButtonClass,
  toggleInteractionTypeFromMenuClick,
  useCurrentLocationClickHandler,
  cancelRouting,
};
