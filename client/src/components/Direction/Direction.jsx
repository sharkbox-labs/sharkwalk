import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import googleApiKey from '../../apiKeys/googleApiKey';

class Direction extends Component {
  // // This function is only for displaying a direction during development
  // // Remove before production
  // componentWillMount() {
  //   // Instantiate Google Services
  //   const directionsDisplay = new google.maps.DirectionsRenderer(); // eslint-disable-line
  //   const directionsService = new google.maps.DirectionsService(); // eslint-disable-line
  //   directionsDisplay.setMap(this.props.map);

  //   // Use fake data
  //   const request = {
  //     origin: new google.maps.LatLng(37.774929, -122.419416), // eslint-disable-line
  //     destination: new google.maps.LatLng(37.7837762, -122.4090387), // eslint-disable-line
  //     travelMode: 'WALKING',
  //   };

  //   // Request route
  //   directionsService.route(request, (result, status) => {
  //     if (status === 'OK') {
  //       directionsDisplay.setDirections(result);
  //     }
  //   });
  // }

  // When the component updates, call the renderDirection method
  componentDidUpdate(prevProps) {
    if (this.props.directionsResponse !== prevProps.directionsResponse) {
      this.renderDirection();
    }
  }

  // Uses the Google Maps Directions Renderer to update the map prop with
  // a new direction
  renderDirection() {
    // Instantiate the Google Maps Directions Renderer
    const directionsDisplay = new google.maps.DirectionsRenderer(); // eslint-disable-line

    // Associate directionsDisplay with the current map
    directionsDisplay.setMap(this.props.map);

    // set directions to directionsDisplay
    directionsDisplay.setDirections(this.props.directionsResponse);
  }

  render() {
    // Component only updates map, does not render anything
    return null;
  }
}

Direction.propTypes = {
  directionsResponse: React.PropTypes.object, // eslint-disable-line
  map: React.PropTypes.object, // eslint-disable-line
};

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(Direction);
