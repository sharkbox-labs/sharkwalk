import React, { Component } from 'react';
import deepEqual from 'deep-equal';
import DestinationIcon from 'material-ui/svg-icons/communication/location-on';
import './InfoWindow.css';

const getDurationDifference = (currentRouteDuration, alternateRouteDuration) => {
  let durationDifference;
  const difference = currentRouteDuration - alternateRouteDuration;
  const description = difference < 0 ? 'slower' : 'faster';
  const absoluteDifference = Math.abs(difference);

  if (absoluteDifference < 60) {
    durationDifference = `${absoluteDifference} sec${(absoluteDifference !== 1 ? 's' : '')} ${description}`;
  } else if (absoluteDifference < 60 * 60) {
    const minutes = Math.floor(absoluteDifference / 60);
    durationDifference = `${minutes}min ${description}`;
  }

  return durationDifference;
};

const getRiskDescription = (risk) => {
  const absoluteRisk = Math.abs(risk);
  const smooth = risk > 5 && risk <= 15 ? 'smoother' : 'smooth';
  const description = risk > 0 ? 'choppy' : `${smooth}`;

  switch (risk) {
    case absoluteRisk <= 5:
      return '<i>Same swell...</i>';

    case absoluteRisk > 5 && absoluteRisk <= 15:
      return `<i>A little ${description}</i> `;

    case absoluteRisk > 15 && absoluteRisk <= 25:
      return `<i>Very ${description}</i>`;

    default:
      return `<i>Hella ${description}</i>`;
  }
};

const displayRiskDifference = (currentRouteAvgRisk, alternateRouteAvgRisk) => {
  // Risk description will be only displayed when the other route is selected so these should be in relation
  // to the other route
  const normalizedRiskDifference = Math.floor(((currentRouteAvgRisk - alternateRouteAvgRisk) / alternateRouteAvgRisk) * 100);

  return getRiskDescription(normalizedRiskDifference);
};

const displayHoursMinutes = (seconds) => {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutesLeft = totalMinutes % 60;
  const hoursDescription = hours > 10 ? 's' : '';
  return `<span class='info-window-time'><b>${hours}hr${hoursDescription} ${minutesLeft}min</b></span>`;
};

const displayMiles = meters => (Math.round(meters * 0.000621371));

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
      if (this.props.routeIndex !== this.props.currentRouteDisplayedIndex) {
        this.state.infoWindow.setContent(`<div class='info-window-not-selected'><b>${this.state.durationDifference}</b></br>${this.state.riskAssessment}</div>`);
        this.state.infoWindow.setZIndex(-10);
      } else {
        this.state.infoWindow.setContent(`<div class='info-window-selected'>${this.state.duration}</br><b><i>${this.state.distance} miles</i></b></div>`);
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

      let infoWindowAnchor;
      if (routeIsCurrentlyDisplayed) {
        // If route currently displayed, anchor the info window one-third into the route
        infoWindowAnchor = Math.floor(this.props.route.path.length / 3);
      } else {
        // If route not currently displayed, anchor the info window two-thirds into the route
        infoWindowAnchor = Math.floor((this.props.route.path.length / 3) * 2);
      }

      const lat = this.props.route.path[infoWindowAnchor][0];
      const lng = this.props.route.path[infoWindowAnchor][1];

      const duration = displayHoursMinutes(this.props.route.duration);
      const distance = displayMiles(this.props.route.distance);
      const differenceDisplay = getDurationDifference(this.props.route.duration,
                                                      this.props.alternateRoute.duration);
      const riskAssessment = displayRiskDifference(this.props.route.averageRisk,
                                                   this.props.alternateRoute.averageRisk);

      const contentClass = routeIsCurrentlyDisplayed ? 'info-window-selected' : 'info-window-not-selected';

      const contentString = `<div ${contentClass}>${duration}</br> <b><i>${distance} miles</b></i></div>`;

      const infoWindow = new window.google.maps.InfoWindow({
        content: contentString,
        position: { lat, lng },
        maxWidth: 90,
      });

      infoWindow.open(this.props.map); // eslint-disable-line

      // Update state with new info window
      this.setState({
        infoWindow,
        duration,
        durationDifference: differenceDisplay,
        distance,
        riskAssessment,
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
  }).isRequired,
  currentRouteDisplayedIndex: React.PropTypes.number.isRequired,
  routeIndex: React.PropTypes.number.isRequired,
};

export default InfoWindow;
