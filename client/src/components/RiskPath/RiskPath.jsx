import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import colorcolor from 'colorcolor';
import googleApiKey from '../../apiKeys/googleApiKey';

const numberToRGBGreenRed = function numberToRGBGreenRed(num) {
  let hue = 120 - (120 * num);
  if (hue < 0) hue = 0;
  if (hue > 120) hue = 120;
  const colorHex = colorcolor(`hsl(${Math.round(hue)}, 100%, 50%)`, 'hex');
  return `${colorHex}`;
};

class RiskPath extends Component {

  constructor(props) {
    super(props);
    this.state = {
      segments: [],
    };
  }

  componentDidMount() {
    this.renderRiskPath();
  }

  /**
   * Generate a line-segment polyline to place on a Google Map
   * @param  {Object} start     The start point. Must have keys `lat` and 'lng'.
   * @param  {Object} end       The end point. Must have keys `lat` and `lng`.
   * @param  {number} intensity A number ranging from 0 to 1. Will color the line from
   * 'least intense' (green) to 'most intense' (red).
   * @return {Object}           The polyline, ready to be set to a map with
   * `.setMap(<map reference>)`.
   */
  generateSegment(start, end, intensity) {
    // eslint-disable-next-line react/prop-types
    const segment = new this.props.google.maps.Polyline({
      path: [{ lat: start[0], lng: start[1] }, { lat: end[0], lng: end[1] }],
      geodesic: true,
      strokeColor: numberToRGBGreenRed(intensity),
      strokeOpacity: 0.75,
      strokeWeight: 7,
    });
    return segment;
  }

  clear() {
    this.state.segments.forEach(segment => segment.setMap(null));
    this.setState({ segments: [] });
  }

  renderRiskPath() {
    const segments = [];
    for (let i = 0; i < this.props.points.length - 1; i += 1) {
      segments.push(
        this.generateSegment(
          this.props.points[i], this.props.points[i + 1], this.props.points[i][2] / 600));
    }
    // eslint-disable-next-line react/prop-types
    segments.forEach(segment => segment.setMap(this.props.map));
    this.setState({ segments });
  }

  render() {
    return null;
  }
}

RiskPath.propTypes = {
  points: React.PropTypes.array.isRequired, // eslint-disable-line
};

export default RiskPath;
