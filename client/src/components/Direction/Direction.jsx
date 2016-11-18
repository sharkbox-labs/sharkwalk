import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import googleApiKey from '../../apiKeys/googleApiKey';

class Direction extends Component {
  // // This function is only for displaying a direction during development
  // // Remove before production
  componentWillMount() {
    const googleMaps = this.props.google.maps; // eslint-disable-line

    // Transforms normal lat/lng object into a google maps object
    // that is required for rendering a route.
    const asLatLng = latLngObject => (
      new googleMaps.LatLng(latLngObject.lat, latLngObject.lng)
    );

    const asBounds = boundsObject => (
      new googleMaps.LatLngBounds(asLatLng(boundsObject.southwest), asLatLng(boundsObject.northeast))
    );

    const asPath = encodedPolyObject => (
      googleMaps.geometry.encoding.decodePath(encodedPolyObject.points)
    );

    const typecastRoutes = routes => (
      routes.map((route) => {
        const transformedRoute = {};

        transformedRoute.bounds = asBounds(route.bounds);

        transformedRoute.overview_path = asPath(route.overview_polyline);

        transformedRoute.legs = route.legs.map((leg) => {
          const transformedLeg = {};
          transformedLeg.start_location = asLatLng(leg.start_location);
          transformedLeg.end_location = asLatLng(leg.end_location);


          transformedLeg.steps = leg.steps.map((step) => {
            const transformedStep = {};
            transformedStep.start_location = asLatLng(step.start_location);
            transformedStep.end_location = asLatLng(step.end_location);
            transformedStep.path = asPath(step.polyline);
            return transformedStep;
          });

          return transformedLeg;
        });

        return transformedRoute;
      })
    );


    const renderer = new googleMaps.DirectionsRenderer();

    const renderDirections = (map, response, request) => {
      // Reformat the response object from the Google Maps API to
      // fit the criteria for googleMaps.DirectionsRenderer

      renderer.setOptions({
        directions: {
          routes: typecastRoutes(response.routes),
          // "request" is important and not returned by web service it's an
          // object containing "origin", "destination" and "travelMode"
          request,
        },
        draggable: true,
        map,
      });
    };

    const request = {
      origin: asLatLng(this.props.origin),
      destination: asLatLng(this.props.destination),
      travelMode: 'WALKING',
    };
    
    renderDirections(this.props.map, this.props.directionsResponse, request);


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
  }

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
