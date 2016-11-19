import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import googleApiKey from '../../apiKeys/googleApiKey';
// import heatmapData2 from './heatmapsampledata';
import getNewRadius from '../utils/heatMapRadiusHelper';

class HeatMap extends Component {
  componentWillMount() {
    this.renderHeatMap();
  }

  // When the componenet updates, if the props have changed call the renderHeatMap method
  componentDidUpdate(prevProps) {
    if (this.props.heatMapResponse !== prevProps.heatMapResponse) {
      this.renderHeatMap();
    }
  }

  // Updates the Google Map with a new Heat Map
  renderHeatMap() {
    // Reformat heatMapResponse to the format required by Google Maps
    const points = this.props.heatMapResponse.map(point => ({
      location: new google.maps.LatLng(point[0], point[1]), // eslint-disable-line
      // weight: point.weight,
      weight: 0,
    }));

    const heatmap = this.props.heatMapDisplay;

    // Associate the Heat Map with the current data and current map
    heatmap.setData(points);
    heatmap.setMap(this.props.map);

    // Add listener
    google.maps.event.addListener(this.props.map, 'zoom_changed', () => { // eslint-disable-line
      heatmap.setOptions({ radius: getNewRadius(this.props.map, google, 256) }); // eslint-disable-line
    });
  }

  render() {
    // Component only updates map, does not render anything
    return null;
  }
}

HeatMap.propTypes = {
  heatMapResponse: React.PropTypes.array.isRequired, // eslint-disable-line
  heatMapDisplay: React.PropTypes.object.isRequired, // eslint-disable-line
  map: React.PropTypes.object, // eslint-disable-line
};

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(HeatMap);
