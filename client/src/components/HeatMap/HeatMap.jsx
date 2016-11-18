import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import googleApiKey from '../../apiKeys/googleApiKey';
import heatmapData from './heatmapsampledata';

class HeatMap extends Component {
  // This function is only for displaying a direction during development
  // Remove before production
  componentWillMount() {
    const points = heatmapData.map((point) => {
      return { location: new google.maps.LatLng(point.location[0], point.location[1]), weight: point.weight }; // eslint-disable-line
    });

    const heatmap = new google.maps.visualization.HeatmapLayer({ data: points, radius: 25, }); // eslint-disable-line
    heatmap.setMap(this.props.map);
  }

  render() {
    // Component only updates map, does not render anything
    return null;
  }
}

HeatMap.propTypes = {
  map: React.PropTypes.object, // eslint-disable-line
};

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(HeatMap);
