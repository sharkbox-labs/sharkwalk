/*
===================================================
  All of the following functions are used
  to transform the response object from the server
  into what is required to have it rendered
  on the map.
===================================================
*/


const asLatLng = (latLngObject, mapObject) => {
  const googleMaps = mapObject;
  return new googleMaps.LatLng(latLngObject.lat, latLngObject.lng);
};

const asBounds = (boundsObject, mapObject) => {
  const googleMaps = mapObject;
  return new googleMaps.LatLngBounds(
    asLatLng(boundsObject.southwest, googleMaps),
    asLatLng(boundsObject.northeast, googleMaps),
    );
};

const asPath = (encodedPolyObject, mapObject) => {
  const googleMaps = mapObject;
  return googleMaps.geometry.encoding.decodePath(encodedPolyObject.points);
};

const typecastRoutes = (routes, mapObject) => {
  const googleMaps = mapObject;

  return routes.map((route) => {
    const transformedRoute = {};

    transformedRoute.bounds = asBounds(route.bounds, googleMaps);
    transformedRoute.overview_path = asPath(route.overview_polyline, googleMaps);
    transformedRoute.legs = route.legs.map((leg) => {

      const transformedLeg = {};

      transformedLeg.start_location = asLatLng(leg.start_location, googleMaps);
      transformedLeg.end_location = asLatLng(leg.end_location, googleMaps);
      transformedLeg.steps = leg.steps.map((step) => {

        const transformedStep = {};

        transformedStep.start_location = asLatLng(step.start_location, googleMaps);
        transformedStep.end_location = asLatLng(step.end_location, googleMaps);
        transformedStep.path = asPath(step.polyline, googleMaps);

        return transformedStep;
      });
      return transformedLeg;
    });
    return transformedRoute;
  });
};

export default {
  asLatLng,
  asBounds,
  asPath,
  typecastRoutes,
};
