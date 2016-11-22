const exampleTripServiceResponse = {
  route: {
    geocoded_waypoints: [
      {
        geocoder_status: 'OK',
        place_id: 'ChIJsfcbRIaAhYARoxpvb3BYBrs',
        types: ['street_address'],
      },
      {
        geocoder_status: 'OK',
        place_id: 'Eio3Ny04NyA2dGggU3QsIFNhbiBGcmFuY2lzY28sIENBIDk0MTAzLCBVU0E',
        types: ['street_address'],
      },
    ],
    routes: [
      {
        bounds: {
          northeast: {
            lat: 37.784395,
            lng: -122.4048747,
          },
          southwest: {
            lat: 37.7809745,
            lng: -122.4090739,
          },
        },
        copyrights: 'Map data ©2016 Google',
        legs: [
          {
            distance: {
              text: '0.4 mi',
              value: 601,
            },
            duration: {
              text: '8 mins',
              value: 459,
            },
            end_address: '77-87 6th St, San Francisco, CA 94103, USA',
            end_location: {
              lat: 37.7812491,
              lng: -122.4090739,
            },
            start_address: '315 Jessie St, San Francisco, CA 94103, USA',
            start_location: {
              lat: 37.7842729,
              lng: -122.4055131,
            },
            steps: [
              {
                distance: {
                  text: '62 ft',
                  value: 19,
                },
                duration: {
                  text: '1 min',
                  value: 14,
                },
                end_location: {
                  lat: 37.784395,
                  lng: -122.405366,
                },
                html_instructions: 'Head <b>northeast</b> toward <b>Jessie St</b>',
                polyline: {
                  points: 'uvreFlibjVW[',
                },
                start_location: {
                  lat: 37.7842729,
                  lng: -122.4055131,
                },
                travel_mode: 'WALKING',
              },
              {
                distance: {
                  text: '200 ft',
                  value: 61,
                },
                duration: {
                  text: '1 min',
                  value: 42,
                },
                end_location: {
                  lat: 37.7840079,
                  lng: -122.4048747,
                },
                html_instructions: 'Turn <b>right</b> onto <b>Jessie St</b>',
                maneuver: 'turn-right',
                polyline: {
                  points: 'mwreFphbjVjAcB',
                },
                start_location: {
                  lat: 37.784395,
                  lng: -122.405366,
                },
                travel_mode: 'WALKING',
              },
              {
                distance: {
                  text: '0.3 mi',
                  value: 478,
                },
                duration: {
                  text: '6 mins',
                  value: 366,
                },
                end_location: {
                  lat: 37.7809745,
                  lng: -122.4087337,
                },
                html_instructions: 'Turn <b>right</b> onto <b>Mission St</b>',
                maneuver: 'turn-right',
                polyline: {
                  points: 'aureFlebjV~@rAX^hAzARXNRv@dAV`@pAfBLRfF`H',
                },
                start_location: {
                  lat: 37.7840079,
                  lng: -122.4048747,
                },
                travel_mode: 'WALKING',
              },
              {
                distance: {
                  text: '141 ft',
                  value: 43,
                },
                duration: {
                  text: '1 min',
                  value: 37,
                },
                end_location: {
                  lat: 37.7812491,
                  lng: -122.4090739,
                },
                html_instructions: 'Turn <b>right</b> onto <b>6th St</b><div style=\'font-size:0.9em\'>Destination will be on the left</div>',
                maneuver: 'turn-right',
                polyline: {
                  points: 'abreFp}bjVw@bA',
                },
                start_location: {
                  lat: 37.7809745,
                  lng: -122.4087337,
                },
                travel_mode: 'WALKING',
              },
            ],
            traffic_speed_entry: [],
            via_waypoint: [],
          },
        ],
        overview_polyline: {
          points: 'uvreFlibjVW[jAcBxArBdDnE~I~Lw@bA',
        },
        summary: 'Mission St',
        warnings: ['Walking directions are in beta.    Use caution – This route may be missing sidewalks or pedestrian paths.'],
        waypoint_order: [],
      },
    ],
    status: 'OK',
  },
  path: [
     [37.78427, -122.40551],
     [37.78439, -122.40537],
     [37.78407841857466, -122.4049600238556],
     [37.78401, -122.40487],
     [37.783698014212995, -122.40527948141371],
     [37.78369, -122.40529],
     [37.78356, -122.40545],
     [37.78323936053653, -122.40584863324122],
     [37.78319, -122.40591],
     [37.78309, -122.40604],
     [37.78301, -122.40614],
     [37.78273, -122.40649],
     [37.78261, -122.40666],
     [37.78229252083578, -122.4070626572582],
     [37.7822, -122.40718],
     [37.78213, -122.40728],
     [37.78181022099139, -122.40767973052215],
     [37.78149044063243, -122.40807945758552],
     [37.78117065892315, -122.40847918119017],
     [37.78097, -122.40873],
     [37.78125, -122.40907],
  ],
};

const exampleRiskServiceResponse = {
  risk: [
    404.0941795852894,
    404.0941795852894,
    337.4021300589101,
    337.4021300589101,
    337.4021300589101,
    337.4021300589101,
    337.4021300589101,
    316.0763851911321,
    300.5997853175396,
    300.5997853175396,
    300.5997853175396,
    300.5997853175396,
    279.1268157276001,
    279.1268157276001,
    279.1268157276001,
    279.1268157276001,
    279.1268157276001,
    279.1268157276001,
    279.1268157276001,
    229.19433509378302,
    229.19433509378302,
    229.19433509378302,
    229.19433509378302,
    114.37777034481681,
    323.7331007017206,
    323.7331007017206,
    323.7331007017206,
    211.97329643912647,
    211.97329643912647,
    211.97329643912647,
    211.97329643912647,
    137.51583461355838,
    137.51583461355838,
    137.51583461355838,
    104.19860762271577,
    104.19860762271577,
    104.19860762271577,
    104.19860762271577,
    104.19860762271577,
    88.59467901669147,
    88.59467901669147,
    88.59467901669147,
    88.59467901669147,
    88.59467901669147,
    88.59467901669147,
    92.49540012045983,
    92.49540012045983,
    92.49540012045983,
  ],
};

module.exports = {
  exampleTripServiceResponse,
  exampleRiskServiceResponse,
};
