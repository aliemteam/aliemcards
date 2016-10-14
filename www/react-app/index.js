import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, browserHistory } from 'react-router';

import Main from './bits/main';
import Home from './bits/home';

injectTapEventPlugin();

ReactDOM.render((
  <Router history={browserHistory}>
    <Route component={Main}>
      <Route path="/home" component={Home} />
    </Route>
  </Router>
  ), document.getElementById('app'));
