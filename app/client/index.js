import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

import NotFound from './pages/not-found';
import Home from './pages/home';
import Main from './partials/main';
import Cards from './cards/cards';
import Card from './cards/card';
import Category from './categories/category';
import Categories from './categories/categories';
import About from './pages/about';
import Contact from './pages/contactform';
import Contacted from './pages/contacted';

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
        <Route name="Contacted" path="contacted" component={Contacted} />
      </Route>

      <Route name="Not Found" path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('app'));
