export const toggleFloatingActionButtonClass = (interactionType, interactionTypes) => (
  interactionType === interactionTypes.SELECTING_ROUTE ? 'floating-action-button-show' : 'floating-action-button-hide'
);
