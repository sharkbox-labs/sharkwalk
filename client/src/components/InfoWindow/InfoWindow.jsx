import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import DestinationIcon from 'material-ui/svg-icons/communication/location-on';
import infoWindowHelpers from '../utils/infoWindowHelpers';
import './InfoWindow.css';

class InfoWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoWindow: new window.google.maps.InfoWindow(),
      duration: null,
      durationDifference: null,
      distance: null,
      riskAssessment: null,
    };
  }

  componentDidUpdate(prevProps) {
    // Only render new info window if new prop is actually a new route
    if (!deepEqual(this.props.route, prevProps.route)) {
      this.clear();
      this.renderInfoWindow();
    } else {
      // If route is currently not displayed, show time travel difference
      if (this.props.routeIndex !== this.props.currentRouteDisplayedIndex && this.props.alternateRoute) {
        this.state.infoWindow.setContent(`<div class='info-window-not-selected'><b>${this.state.durationDifference}</b></br>${this.state.riskAssessment}</div>`);
        this.state.infoWindow.setZIndex(-10);
      } else {
        const distanceDescription = this.state.distance > 1 ? 's' : '';
        this.state.infoWindow.setContent(`<div class='info-window-selected'>${this.state.duration}</br><b><i>${this.state.distance} mile${distanceDescription}</i></b></div>`);
        this.state.infoWindow.setZIndex(10);
      }

      const isInfoWindowOpen = (infoWindow) => {
        const map = infoWindow.getMap();
        return (map !== null && typeof map !== 'undefined');
      };

      // Reopen window if info window has been closed and there is a route currently rendered
      if (!isInfoWindowOpen(this.state.infoWindow) && this.props.route.path.length > 0) {
        this.state.infoWindow.open(this.props.map); // eslint-disable-line
      }
    }
  }

  

  // Used to clear map of old info window
  clear() {
    this.state.infoWindow.close();
  }

  renderInfoWindow() {
    // Check that the route has path points that will be rendered
    if (this.props.route.path.length > 0) {
      const routeIsCurrentlyDisplayed = this.props.routeIndex ===
                                        this.props.currentRouteDisplayedIndex;

      // If route currently displayed, anchor the info window one-third into the route
      let infoWindowAnchor;
      if (routeIsCurrentlyDisplayed) {
        infoWindowAnchor = Math.floor(this.props.route.path.length / 3);
      } else {
        // If route is not currently displayed, anchor the info window two-thirds into the route
        infoWindowAnchor = Math.floor((this.props.route.path.length / 3) * 2);
      }

      const lat = this.props.route.path[infoWindowAnchor][0];
      const lng = this.props.route.path[infoWindowAnchor][1];

      const duration = infoWindowHelpers.displayHoursMinutes(this.props.route.duration);
      const distance = infoWindowHelpers.displayMiles(this.props.route.distance);

      
      // Check for duration and risk difference if an alternate route exists
      let differenceDisplay;
      let riskAssessment;
      if (this.props.alternateRoute) {
        differenceDisplay = infoWindowHelpers.getDurationDifference(this.props.route.duration,
                                                        this.props.alternateRoute.duration);
        riskAssessment = infoWindowHelpers.displayRiskDifference(this.props.route.averageRisk,
                                                     this.props.alternateRoute.averageRisk);  
      }

      const contentClass = routeIsCurrentlyDisplayed ? 'info-window-selected' : 'info-window-not-selected';

      const distanceDescription = distance > 1 ? 's' : '';

      const contentString = `<div ${contentClass}>${duration}</br> <b><i>${distance} mile${distanceDescription}</b></i></div>`;

      const infoWindow = new window.google.maps.InfoWindow({
        content: contentString,
        position: { lat, lng },
      });

      infoWindow.open(this.props.map); // eslint-disable-line

      // Update state with new info window
      this.setState({
        infoWindow,
        duration,
        durationDifference: differenceDisplay || null,
        distance,
        riskAssessment: riskAssessment || null,
      });
    }
  }

  render() {
    return null;
  }
}

InfoWindow.propTypes = {
  route: React.PropTypes.shape({
    risks: React.PropTypes.array.isRequired,
    maxRisk: React.PropTypes.number.isRequired,
    averageRisk: React.PropTypes.number.isRequired,
    riskWeight: React.PropTypes.number.isRequired,
    distance: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number.isRequired,
    googleMapsUrl: React.PropTypes.string.isRequired,
    path: React.PropTypes.array.isRequired,
  }).isRequired,
  alternateRoute: React.PropTypes.shape({
    risks: React.PropTypes.array.isRequired,
    maxRisk: React.PropTypes.number.isRequired,
    averageRisk: React.PropTypes.number.isRequired,
    riskWeight: React.PropTypes.number.isRequired,
    distance: React.PropTypes.number.isRequired,
    duration: React.PropTypes.number.isRequired,
    googleMapsUrl: React.PropTypes.string.isRequired,
    path: React.PropTypes.array.isRequired,
  }),
  currentRouteDisplayedIndex: React.PropTypes.number.isRequired,
  routeIndex: React.PropTypes.number.isRequired,
};

export default InfoWindow;
