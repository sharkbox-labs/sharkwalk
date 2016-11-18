/*
===================================================
  All of the following functions are used
  to transform the response object from the server
  into what is required to have it rendered
  on the map.
===================================================
*/


const asLatLng = (latLngObject, googleMapsObject) => {
  return new googleMapsObject.LatLng(latLngObject.lat, latLngObject.lng);
};

const asBounds = (boundsObject, googleMapsObject) => {
  return new googleMapsObject.LatLngBounds(
    asLatLng(boundsObject.southwest, googleMapsObject),
    asLatLng(boundsObject.northeast, googleMapsObject),
    );
};

const asPath = (encodedPolyObject, googleMapsObject) => {
  return googleMapsObject.geometry.encoding.decodePath(encodedPolyObject.points);
};

const typecastRoutes = (routes, googleMapsObject) => {

  return routes.map((route) => {
    const transformedRoute = {};

    transformedRoute.bounds = asBounds(route.bounds, googleMapsObject);
    transformedRoute.overview_path = asPath(route.overview_polyline, googleMapsObject);
    transformedRoute.legs = route.legs.map((leg) => {

      const transformedLeg = {};

      transformedLeg.start_location = asLatLng(leg.start_location, googleMapsObject);
      transformedLeg.end_location = asLatLng(leg.end_location, googleMapsObject);
      transformedLeg.steps = leg.steps.map((step) => {

        const transformedStep = {};

        transformedStep.start_location = asLatLng(step.start_location, googleMapsObject);
        transformedStep.end_location = asLatLng(step.end_location, googleMapsObject);
        transformedStep.path = asPath(step.polyline, googleMapsObject);

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
