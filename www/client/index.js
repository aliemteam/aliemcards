import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

import NotFound from './bits/not-found';
import Home from './bits/home';
import Main from './bits/main';
import Cards from './bits/cards';
import Card from './bits/card';
import Category from './bits/category';
import Categories from './bits/categories';
import About from './bits/about';
import Contact from './bits/contactform';

require('dotenv').config();

ReactDOM.render((
  <Router history={browserHistory}>
    <Route name="Home" path="/">
      <IndexRoute component={Home} />

      <Route name="Cards" path="/cards" component={Main}>
        <IndexRoute component={Cards} />
        <Route name="Card" path=":slug" component={Card} />
      </Route>
      <Route name="Card" path="/cards/:slug" component={Card} />

      <Route name="Categories" path="/categories" component={Main}>
        <IndexRoute component={Categories} />
        <Route name="Category" path=":catslug" addHandlerKey>
          <IndexRoute component={Category} />
          <Route name="CatCard" path=":slug" component={Card} />
        </Route>
      </Route>

      <Route name="Pages" path="/pages" component={Main}>
        <Route name="About" path="about" component={About} />
        <Route name="Contact" path="contact" component={Contact} />
      </Route>

      <Route name="Not Found" path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('app'));
