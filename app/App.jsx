import React from 'react';
import { BrowserRouter, Match, Miss } from 'react-router';

import lazyLoad from './utils/LazyLoad';
import Header from './components/Header';
import Footer from './components/Footer';
import EditorTools from './cards/EditorTools';

import './assets/css/main';

const Home = lazyLoad(() =>
  System.import('./pages/Home').then(module => module.default)
);
const Cards = lazyLoad(() =>
  System.import('./cards/Cards').then(module => module.default)
);
// const EditorTools = lazyLoad(() =>
//   System.import('./cards/EditorTools').then(module => module.default)
// );
const Card = lazyLoad(() =>
  System.import('./cards/Card').then(module => module.default)
);
const Categories = lazyLoad(() =>
  System.import('./categories/Categories').then(module => module.default)
);
const Category = lazyLoad(() =>
  System.import('./categories/Category').then(module => module.default)
);
const About = lazyLoad(() =>
  System.import('./pages/About').then(module => module.default)
);
const Contact = lazyLoad(() =>
  System.import('./pages/Contact').then(module => module.default)
);
const FourOhFour = lazyLoad(() =>
  System.import('./pages/404').then(module => module.default)
);

const App = props => (
  <div className="row row--stacked main">
    <Header {...props} />
    <main className="content" role="main">
      <Match exactly pattern="/" component={Home} />
      <Match exactly pattern="/cards" component={Cards} />
      <Match pattern="/cards/:id" component={Card} />
      <Match exactly pattern="/editortools" component={EditorTools} />
      <Match exactly pattern="/categories" component={Categories} />
      <Match pattern="/categories/:category" component={Category} />
      <Match pattern="/about" component={About} />
      <Match pattern="/contact" component={Contact} />
      <Miss component={FourOhFour} />
    </main>
    <Footer />
  </div>
);

export default () => (
  <BrowserRouter>
    <Match pattern="/" component={App} />
  </BrowserRouter>
);
