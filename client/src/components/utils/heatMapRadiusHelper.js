const getNewRadius = (map, google, TILE_SIZE) => {
  function mercatorProjection(center, moved) {
    const pixelOrigin = new google.maps.Point(TILE_SIZE / 2, TILE_SIZE / 2);
    const pixelsPerLonDegree = TILE_SIZE / 360;
    const pixelsPerLonRadian = TILE_SIZE / (2 * Math.PI);

    const bound = (value, optMin, optMax) => {
      if (optMin !== null) value = Math.max(value, optMin); // eslint-disable-line
      if (optMax !== null) value = Math.min(value, optMax); // eslint-disable-line
      return value;
    };

    const degreesToRadians = deg => (
      deg * (Math.PI / 180)
    );

    const fromLatLngToPoint = (latLng, optPoint) => {
      const point = optPoint || new google.maps.Point(0, 0);

      point.x = pixelOrigin.x + latLng.lng() * pixelsPerLonDegree; // eslint-disable-line

      // NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
      // 89.189.  This is about a third of a tile past the edge of the world
      // tile.
      const siny = bound(Math.sin(degreesToRadians(latLng.lat())), -0.9999, 0.9999);
      point.y = pixelOrigin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -pixelsPerLonRadian; // eslint-disable-line

      return point;
    };

    const initCoord = fromLatLngToPoint(center);
    const endCoord = fromLatLngToPoint(moved);

    return {
      initCoord,
      endCoord,
    };
  }

  const desiredRadiusPerPointInMeters = 20;
  const numTiles = 1 << map.getZoom(); // eslint-disable-line
  const center = map.getCenter();
  // 1000 meters to the right
  const moved = google.maps.geometry.spherical.computeOffset(center, 10000, 90);
  const projection = mercatorProjection(center, moved);
  const initCoord = projection.initCoord;
  const endCoord = projection.endCoord;
  const initPoint = new google.maps.Point(
    initCoord.x * numTiles,
    initCoord.y * numTiles,
  );
  const endPoint = new google.maps.Point(
    endCoord.x * numTiles,
    endCoord.y * numTiles,
  );
  const pixelsPerMeter = (Math.abs(initPoint.x - endPoint.x)) / 10000.0;
  const totalPixelSize = Math.floor(desiredRadiusPerPointInMeters * pixelsPerMeter);

  return totalPixelSize;
};

export default getNewRadius;
