import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import App from './App';
import './index.css';

ReactDOM.render((
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <Router history={browserHistory}>
      <Route path="/" component={App} />
    </Router>
  </MuiThemeProvider>
  ), document.getElementById('root'),
);
