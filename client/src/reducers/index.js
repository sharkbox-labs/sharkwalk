const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DESTINATION':
      return Object.assign({}, state, { destination: action.destination });

    case 'SET_ORIGIN':
      return Object.assign({}, state, { origin: action.origin });

    case 'SET_INTERACTION_TYPE':
      return Object.assign({}, state, { interactionType: action.interactionType });

    case 'SET_CURRENT_ROUTE':
      return Object.assign({}, state, { currentRoute: action.routeIndex });

    default:
      return state;
  }
};

export default reducer;
