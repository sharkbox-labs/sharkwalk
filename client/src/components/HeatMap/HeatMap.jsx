import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import googleApiKey from '../../apiKeys/googleApiKey';
// import heatmapData from './heatmapsampledata';

class HeatMap extends Component {
  // // This function is only for displaying a direction during development
  // // Remove before production
  // componentWillMount() {
  //   const points = heatmapData.map(point => (
  //     {
  //       location: new google.maps.LatLng(point.location[0], point.location[1]), // eslint-disable-line
  //       weight: point.weight,
  //     }
  //   ));

  //   const heatmap = new google.maps.visualization.HeatmapLayer({ data: points, radius: 25, }); // eslint-disable-line

  //   heatmap.setMap(this.props.map);
  // }

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
      location: new google.maps.LatLng(point.location[0], point.location[1]), // eslint-disable-line
      weight: point.weight,
    }));

    // Instantiate the Google Maps Visualization Heat Map Layer with the data and radius
    const heatmap = new google.maps.visualization.HeatmapLayer({ // eslint-disable-line
      data: points,
      radius: 25,
    });

    // Associate the Heat Map with the current map
    heatmap.setMap(this.props.map);
  }

  render() {
    // Component only updates map, does not render anything
    return null;
  }
}

HeatMap.propTypes = {
  heatMapResponse: React.PropTypes.array, // eslint-disable-line
  map: React.PropTypes.object, // eslint-disable-line
};

export default GoogleApiWrapper({
  apiKey: googleApiKey,
})(HeatMap);
