export const setDestination = (destination) => {
  return {
    type: 'SET_DESTINATION',
    destination,
  };
};

export const setOrigin = (origin) => {
  return {
    type: 'SET_ORIGIN',
    origin,
  };
};

export const setInteractionType = (interactionType) => {
  return {
    type: 'SET_INTERACTION_TYPE',
    interactionType,
  };
};

export const setCurrentRoute = (routeIndex) => {
  return {
    type: 'SET_CURRENT_ROUTE',
    routeIndex,
  };
};

export const setRouteResponse = (routeResponse) => {
  return {
    type: 'SET_ROUTE_RESPONSE',
    routeResponse,
  };
};
