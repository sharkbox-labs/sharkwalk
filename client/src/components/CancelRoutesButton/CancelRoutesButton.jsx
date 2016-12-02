import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Clear from 'material-ui/svg-icons/content/clear';

const CancelRoutesButton = (props) => {
  if (props.interactionType === 'SELECTING_ROUTE' && props.routeResponse[0].path.length) {
    return (
      <FloatingActionButton
        className="clear-button"
        onClick={props.clickAction}
        mini
        backgroundColor={'rgb(200,8,8)'}

      >
        <Clear className="clear-icon" />
      </FloatingActionButton>
    );
  }
  return null;
};

CancelRoutesButton.propTypes = {
  routeResponse: React.PropTypes.array.isRequired,
  interactionType: React.PropTypes.string.isRequired,
  isFetchingRouteData: React.PropTypes.bool.isRequired,
  clickAction: React.PropTypes.func,
};

export default CancelRoutesButton;

