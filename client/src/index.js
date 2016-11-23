import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppContainer from './containers/AppContainer/AppContainer';
import reducer from './reducers/index';
import './index.css';

const store = createStore(
  reducer,
  {},
  applyMiddleware(thunk),
);

ReactDOM.render((
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
      <AppContainer />
    </MuiThemeProvider>
  </Provider>
  ), document.getElementById('root'),
);
