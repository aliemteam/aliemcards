import * as React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Announcements from './components/Announcements';
import Footer from './components/Footer';
import Header from './components/Header';
import lazyLoad from './utils/LazyLoad';

import './assets/css/main';

const Home = lazyLoad(async () => import('./pages/Home').then(mod => mod.default));
const Cards = lazyLoad(async () => import('./cards/').then(mod => mod.default));
const Card = lazyLoad(async () => import('./cards/Card').then(mod => mod.default));
const About = lazyLoad(async () => import('./pages/About').then(mod => mod.default));
const Contact = lazyLoad(async () => import('./pages/Contact').then(mod => mod.default));
const FourOhFour = lazyLoad(async () => import('./pages/404').then(mod => mod.default));
const Categories = lazyLoad(async () => import('./categories/Categories').then(mod => mod.default));
const Category = lazyLoad(async () => import('./categories/Category').then(mod => mod.default));

interface Props {
  location: {
    pathname: string;
  };
}

interface State {
  announcements: boolean;
}

class App extends React.PureComponent<Props, State> {
  static structuredData = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: 'ALiEM Cards',
    url: 'https://www.aliemcards.com',
  };

  constructor(props) {
    super(props);
    this.state = {
      announcements: true,
    };
  }

  render(): JSX.Element {
    return (
      <div className="row row--stacked main">
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(App.structuredData)}</script>
        </Helmet>
        <Header {...this.props} />
        {this.state.announcements && <Announcements />}
        <main className="content container" role="main">
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
  }
}

export default (): JSX.Element => (
  <Router>
    <Route path="/" component={App} />
  </Router>
);
