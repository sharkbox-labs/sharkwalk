// Transforms an object containing lat/lng properties into
// a LatLng object that is required by Google's
// web service directions renderer
const asLatLng = (latLngObject, googleMapsObject) => (
  new googleMapsObject.LatLng(latLngObject.lat, latLngObject.lng)
);

// Construct a 'bounds' object to be used by
// Google's web service directions renderer
const asBounds = (boundsObject, googleMapsObject) => (
  new googleMapsObject.LatLngBounds(
    // Utilize the asLatLng function above to transform
    // the 'southwest' and 'northeast' properties into
    // LatLng objects
    asLatLng(boundsObject.southwest, googleMapsObject),
    asLatLng(boundsObject.northeast, googleMapsObject),
    )
);

// Utilizes the geometry library from the Google Maps API to
// decode an encoded polyline into a sequence of LatLngs
const asPath = (encodedPolyObject, googleMapsObject) => (
  googleMapsObject.geometry.encoding.decodePath(encodedPolyObject.points)
);

// Utilizes the functions above to transform the route object
// received from the Google Maps API into what is required by
// Google's web service directions renderer
const typecastRoutes = (routes, googleMapsObject) => (
  routes.map((route) => {
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
  })
);

export default {
  asLatLng,
  asBounds,
  asPath,
  typecastRoutes,
};
