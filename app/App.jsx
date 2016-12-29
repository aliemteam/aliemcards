import React from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import IndexRoute from 'react-router/lib/IndexRoute';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';

import Index from './pages/Main';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FourOhFour from './pages/404';
import Cards from './cards/Cards';
import Card from './cards/Card';
import Category from './categories/Category';
import Categories from './categories/Categories';

import './assets/css/main';

export default () => (
  <Router history={browserHistory}>
    <Route name="Home" path="/" component={Index}>
      <IndexRoute component={Home} />
      <Route name="Cards" path="cards" component={Cards} />
      <Route name="Card" path="cards/:id" component={Card} />
      <Route name="Categories" path="categories" component={Categories} />
      <Route name="Category" path="categories/:category" component={Category} />
      <Route name="About" path="about" component={About} />
      <Route name="Contact" path="contact" component={Contact} />
      <Route name="404" path="*" component={FourOhFour} />
    </Route>
  </Router>
);
