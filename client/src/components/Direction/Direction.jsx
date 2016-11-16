import React, { Component } from 'react';

class Direction extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.directionsResponse !== prevProps.directionsResponse) {
      this.renderDirection();
    }
  }

  renderDirection() {
    const directionService = new google.maps.DirectionService();
  }

  render() {
    return null;
  }
}

Direction.propTypes = {
  // eslint-disable-next-line
  directionsResponse: React.propTypes.object,
};

export default Direction;
