import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';
import './index.css';

ReactDOM.render((
  <div>
    <Router history={browserHistory}>
      <Route path="/" component={App} />
    </Router>
  </div>
  ), document.getElementById('root'),
);
