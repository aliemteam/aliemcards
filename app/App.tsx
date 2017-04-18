import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import lazyLoad from './utils/LazyLoad';

import './assets/css/main';

declare const System;

const Home = lazyLoad(() => (
  System.import('./pages/Home').then(module => module.default)
));
const Cards = lazyLoad(() => (
  System.import('./cards/').then(module => module.default)
));
const Card = lazyLoad(() => (
  System.import('./cards/Card').then(module => module.default)
));
const Categories = lazyLoad(() => (
  System.import('./categories/Categories').then(module => module.default)
));
const Category = lazyLoad(() => (
  System.import('./categories/Category').then(module => module.default)
));
const About = lazyLoad(() => (
  System.import('./pages/About').then(module => module.default)
));
const Contact = lazyLoad(() => (
  System.import('./pages/Contact').then(module => module.default)
));
const FourOhFour = lazyLoad(() => (
  System.import('./pages/404').then(module => module.default)
));

const App = props => (
  <div className="row row--stacked main">
    <div className="alphaalert">Alpha development release. Not for public sharing.</div>
    <Header {...props} />
    <main className="content" role="main">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/cards" component={Cards} />
        <Route path="/cards/:id" component={Card} />
        <Route exact path="/categories" component={Categories} />
        <Route path="/categories/:category" component={Category} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route component={FourOhFour} />
      </Switch>
    </main>
    <Footer />
  </div>
);

export default () => (
  <Router>
    <Route path="/" component={App} />
  </Router>
);
