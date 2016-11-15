import React from 'react';
import googleApiKey from '../../apiKeys/googleApiKey';

const src = 'https://maps.googleapis.com/maps/api/js?key=' + googleApiKey + '&callback=initMap';

const GoogleMap = props => (
  <div>
    <div id="map" />
    <script async defer src={src}>
    </script>
  </div>
);

GoogleMap.propTypes = {
  getDirections: React.PropTypes.func.isRequired,
};

export default GoogleMap;
