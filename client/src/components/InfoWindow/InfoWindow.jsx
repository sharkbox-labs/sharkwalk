import React, { Component } from 'react';
import deepEqual from 'deep-equal';

class InfoWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoWindow: new window.google.maps.InfoWindow(),
    };
  }

  componentDidMount() {
    this.clear();
    this.renderInfoWindow();
  }

  componentDidUpdate(prevProps) {
    // Only render new info window if new prop is actually a new route
    if (!deepEqual(this.props.route, prevProps.route)) {
      this.clear();
      this.renderInfoWindow();
    } else {
      const isInfoWindowOpen = (infoWindow) => {
        const map = infoWindow.getMap();
        return (map !== null && typeof map !== 'undefined');
      };

      // Reopen window if info window has been closed and there is a route currently rendered
      if (this.props.route.path.length > 0 && !isInfoWindowOpen(this.state.infoWindow)) {
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
      // Render the info window at the midpoint of the route
      const midpoint = Math.floor(this.props.route.path.length / 2);
      const lat = this.props.route.path[midpoint][0];
      const lng = this.props.route.path[midpoint][1];

      const displayHoursMinutes = (seconds) => {
        const totalMinutes = Math.round(seconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutesLeft = totalMinutes % 60;
        return hours < 10 ? `0${hours}:${minutesLeft}` : `${hours}:${minutesLeft}`;
      };

      const displayMiles = meters => (Math.round(meters * 0.000621371));

      const duration = displayHoursMinutes(this.props.route.duration);
      const distance = displayMiles(this.props.route.distance);

      const contentString = `<p><b>Duration:</b> ${duration}</br>
        <b>Distance:</b> ${distance} miles`;

      const infoWindow = new window.google.maps.InfoWindow({
        content: contentString,
        position: { lat, lng },
      });

      infoWindow.open(this.props.map); // eslint-disable-line

      // Update state with new info window
      this.setState({
        infoWindow,
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
};

export default InfoWindow;
