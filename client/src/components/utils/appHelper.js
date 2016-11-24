const toggleFloatingActionButtonClass = (interactionType, interactionTypes) => (
  interactionType === interactionTypes.SELECTING_ROUTE ? 'floating-action-button-show' : 'floating-action-button-hide'
);

const toggleInteractionTypeFromMenuClick = (currentInteractionType, dispatcher, interactionTypes) => {
  if (currentInteractionType === interactionTypes.VIEWING_MAP) {
    console.log('in VIEWING_MAP');
    dispatcher(interactionTypes.VIEWING_SIDEBAR);
  }

  if (currentInteractionType === interactionTypes.VIEWING_SIDEBAR) {
    console.log('in VIEWING_SIDEBAR');
    dispatcher(interactionTypes.VIEWING_MAP);
  }
};

export default {
  toggleFloatingActionButtonClass,
  toggleInteractionTypeFromMenuClick,
};
