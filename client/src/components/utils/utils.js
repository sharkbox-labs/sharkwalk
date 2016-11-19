// Transforms an object containing lat/lng properties into
// a LatLng object that is required by Google's
// web service directions renderer
const transformLatLng = (latLngObject, googleMapsObject) => (
  new googleMapsObject.LatLng(latLngObject.lat, latLngObject.lng)
);

// Construct a 'bounds' object to be used by
// Google's web service directions renderer
const transformBounds = (boundsObject, googleMapsObject) => (
  new googleMapsObject.LatLngBounds(
    // Utilize the transformLatLng function above to transform
    // the 'southwest' and 'northeast' properties into
    // LatLng objects
    transformLatLng(boundsObject.southwest, googleMapsObject),
    transformLatLng(boundsObject.northeast, googleMapsObject),
    )
);

// Utilizes the geometry library from the Google Maps API to
// decode an encoded polyline into a sequence of LatLngs
const decodePolyline = (encodedPolyObject, googleMapsObject) => (
  googleMapsObject.geometry.encoding.decodePath(encodedPolyObject.points)
);

// Utilizes the functions above to transform the route object
// received from the Google Maps API into what is required by
// Google's web service directions renderer
const transformRoutes = (routes, googleMapsObject) => (
  routes.map((route) => {
    const transformedRoute = {};

    transformedRoute.bounds = transformBounds(route.bounds, googleMapsObject);
    transformedRoute.overview_path = decodePolyline(route.overview_polyline, googleMapsObject);
    transformedRoute.legs = route.legs.map((leg) => {
      const transformedLeg = {};

      transformedLeg.start_location = transformLatLng(leg.start_location, googleMapsObject);
      transformedLeg.end_location = transformLatLng(leg.end_location, googleMapsObject);
      transformedLeg.steps = leg.steps.map((step) => {
        const transformedStep = {};

        transformedStep.start_location = transformLatLng(step.start_location, googleMapsObject);
        transformedStep.end_location = transformLatLng(step.end_location, googleMapsObject);
        transformedStep.path = decodePolyline(step.polyline, googleMapsObject);

        return transformedStep;
      });
      return transformedLeg;
    });
    return transformedRoute;
  })
);

export default {
  transformLatLng,
  transformBounds,
  decodePolyline,
  transformRoutes,
};
