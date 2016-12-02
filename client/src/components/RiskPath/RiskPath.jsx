import React, { Component } from 'react';
import colorcolor from 'colorcolor';
import deepEqual from 'deep-equal';

const numberToRGBGreenRed = function numberToRGBGreenRed(num) {
  let hue = 120 - (120 * num);
  if (hue < 0) hue = 0;
  if (hue > 120) hue = 120;
  const colorHex = colorcolor(`hsl(${Math.round(hue)}, 100%, 50%)`, 'hex');
  return `${colorHex}`;
};

const numberToRGBGreenRedLowOpacity = function numberToRGBGreenRedLowOpacity(num) {
  let hue = 120 - (120 * num);
  if (hue < 0) hue = 0;
  if (hue > 120) hue = 120;
  const colorHex = colorcolor(`hsl(${Math.round(hue)}, 45%, 70%)`, 'hex');
  return `${colorHex}`;
};

/**
 * Generate a line-segment polyline to place on a Google Map
 * @param  {Object} start     The start point. Must have keys `lat` and 'lng'.
 * @param  {Object} end       The end point. Must have keys `lat` and `lng`.
 * @param  {number} intensity A number ranging from 0 to 1. Will color the line from
 * 'least intense' (green) to 'most intense' (red).
 * @return {Object}           The polyline, ready to be set to a map with
 * `.setMap(<map reference>)`.
 */
const generateSegment = (start, end, intensity, currentRouteIndex, index) => {
  const segment = new window.google.maps.Polyline({
    path: [{ lat: start[0], lng: start[1] }, { lat: end[0], lng: end[1] }],
    geodesic: true,
    strokeColor: index === currentRouteIndex ? numberToRGBGreenRed(intensity) : numberToRGBGreenRedLowOpacity(intensity),
    strokeOpacity: index === currentRouteIndex ? 0.75 : 0.55,
    strokeWeight: index === currentRouteIndex ? 7 : 6,
    zIndex: index === currentRouteIndex ? 1 : 0,
  });

  return segment;
};

class RiskPath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      segments: [],
    };
  }

  componentDidMount() {
    this.clear();
    this.renderRiskPath();
  }

  componentDidUpdate(prevProps) {
    if (!deepEqual(this.props.points, prevProps.points) ||
        !deepEqual(this.props.currentRouteIndex, prevProps.currentRouteIndex)) {
      this.clear();
      this.renderRiskPath();
    }
  }

  clear() {
    this.state.segments.forEach(segment => segment.setMap(null));
    this.setState({ segments: [] });
  }

  renderRiskPath() {
    const segments = [];
    for (let i = 0; i < this.props.points.length - 1; i += 1) {
      segments.push(
        generateSegment(
          this.props.points[i],
          this.props.points[i + 1],
          this.props.risks[i] / 300,
          this.props.currentRouteIndex,
          this.props.index,
        ),
      );
    }
    // eslint-disable-next-line react/prop-types
    segments.forEach((segment) => {
      segment.setMap(this.props.map);

      // Add listener
      window.google.maps.event.addListener(segment, 'click', () => {
        this.props.changeRoute(this.props.index);
      });
    });

    // Refocus map
    if (this.props.map && this.props.origin.lat !== 400) {
      const northMostLat = this.props.origin.lat >= this.props.destination.lat ? this.props.origin.lat : this.props.destination.lat;
      const southMostLat = this.props.origin.lat >= this.props.destination.lat ? this.props.destination.lat : this.props.origin.lat;
      const westMostLng = this.props.origin.lng <= this.props.destination.lng ? this.props.origin.lng : this.props.destination.lng;
      const eastMostLng = this.props.origin.lng <= this.props.destination.lng ? this.props.destination.lng : this.props.origin.lng;

      this.props.map.fitBounds(
        new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(southMostLat - 0.0045, westMostLng - 0.0015),
          new window.google.maps.LatLng(northMostLat + 0.0000, eastMostLng + 0.0015),
        ),
      );
    }

    this.setState({ segments });
  }

  render() {
    return null;
  }
}

RiskPath.propTypes = {
  changeRoute: React.PropTypes.func.isRequired,
  currentRouteIndex: React.PropTypes.number.isRequired,
  destination: React.PropTypes.shape({
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
  }),
  index: React.PropTypes.number.isRequired,
  origin: React.PropTypes.shape({
    lat: React.PropTypes.number.isRequired,
    lng: React.PropTypes.number.isRequired,
  }),
  points: React.PropTypes.arrayOf(
    React.PropTypes.arrayOf(
      React.PropTypes.number,
    ),
  ).isRequired,
  risks: React.PropTypes.arrayOf(
    React.PropTypes.number,
  ),
};

export default RiskPath;
