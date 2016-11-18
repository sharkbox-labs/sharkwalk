import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import googleApiKey from '../../apiKeys/googleApiKey';
import utils from '../utils/utils';

class Direction extends Component {
  componentWillMount() {
    // Render the directions on the map before the component mounts
    this.renderDirection(this.props.directionsResponse);
  }

  // When the component updates, call the renderDirection method
  componentDidUpdate(prevProps) {
    if (this.props.directionsResponse !== prevProps.directionsResponse) {
      this.renderDirection(this.props.directionsResponse);
    }
  }

  // Uses the Google Maps Directions Renderer to update the map prop with
  // a new direction
  renderDirection(response) {
    // Create request object required to render the directions object on the map
    const request = {
      origin: utils.asLatLng(this.props.origin, this.props.google.maps),
      destination: utils.asLatLng(this.props.destination, this.props.google.maps),
      travelMode: 'WALKING',
    };

    // Instantiate the Google Maps Directions Renderer
    const directionsDisplay = new google.maps.DirectionsRenderer(); // eslint-disable-line

    // Set directions to directionsDisplay
    directionsDisplay.setOptions({
      directions: {
        routes: utils.typecastRoutes(response.routes, this.props.google.maps),
        request,
      },
      draggable: true,
      map: this.props.map,
    });
  }

  render() {
    // Component only updates map, does not render anything
    return null;
  }
}

Direction.propTypes = {
  directionsResponse: React.PropTypes.object.isRequired, // eslint-disable-line
  map: React.PropTypes.object.isRequired, // eslint-disable-line
  origin: React.PropTypes.shape({
    lat: React.PropTypes.number,
    lng: React.PropTypes.number,
  }).isRequired,
  destination: React.PropTypes.shape({
    lat: React.PropTypes.number,
    lng: React.PropTypes.number,
  }).isRequired,
};

export default GoogleApiWrapper({
  apiKey: googleApiKey,
  libraries: ['geometry', 'places'], // eslint-disable-line
})(Direction);