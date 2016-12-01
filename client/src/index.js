import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import screenfull from 'screenfull';
import AppContainer from './containers/AppContainer/AppContainer';
import reducer from './reducers/index';
import './index.css';

document.getElementById('root').addEventListener('mouseover', () => {
  if (screenfull.enabled) screenfull.request();
});

const initialStore = {
  currentLocation: {
    lat: 400,
    lng: 400,
  },
  currentRouteIndex: 0,
  destination: {
    lat: 400,
    lng: 400,
  },
  interactionType: 'VIEWING_MAP',
  isFetchingRouteData: false,
  origin: {
    lat: 400,
    lng: 400,
  },
  routeResponse: [
    {
      risks: [],
      maxRisk: 0,
      averageRisk: 0,
      riskWeight: 0,
      distance: 0,
      duration: 0,
      googleMapsUrl: '',
      path: [],
    },
    {
      risks: [],
      maxRisk: 0,
      averageRisk: 0,
      riskWeight: 0,
      distance: 0,
      duration: 0,
      googleMapsUrl: '',
      path: [],
    },
    {
      risks: [],
      maxRisk: 0,
      averageRisk: 0,
      riskWeight: 0,
      distance: 0,
      duration: 0,
      googleMapsUrl: '',
      path: [],
    },
  ],
  destinationSearchResults: [],
  originSearchResults: [],
};

const store = createStore(
  reducer,
  initialStore,
);

ReactDOM.render((
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
      <AppContainer />
    </MuiThemeProvider>
  </Provider>
  ), document.getElementById('root'),
);
