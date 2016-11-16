import React, { Component } from 'react';

class Direction extends Component {
  componentWillMount() {
    this.renderDirection();
  }

  componentDidUpdate(prevProps) {
    if (this.props.directionsResponse !== prevProps.directionsResponse) {
      this.renderDirection();
    }
  }

  renderDirection() {
    // eslint-disable-next-line
    const directionsDisplay = new google.maps.DirectionsRenderer();
    // eslint-disable-next-line
    const directionsService = new google.maps.DirectionsService();
    directionsDisplay.setMap(this.props.map);
    const request = {
      // eslint-disable-next-line
      origin: new google.maps.LatLng(37.774929, -122.419416),
      // eslint-disable-next-line
      destination: new google.maps.LatLng(37.7837762, -122.4090387),
      travelMode: 'WALKING',
    };
    directionsService.route(request, function (result, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
      }
    });

    // set directionsDisplay to use the current map
    // directionsDisplay.setMap(this.props.map);

    // set directions to directionsDisplay
    // directionsDisplay.setDirections(this.props.directionsResponse);
    // directionsDisplay.setDirections(testDirection);
  }

  render() {
    return null;
  }
}

Direction.propTypes = {
  // eslint-disable-next-line
  // directionsResponse: React.propTypes.object,
  // eslint-disable-next-line
  // map: React.propTypes.object,
};

export default Direction;
