import * as React from 'react';
import { Helmet } from 'react-helmet';
import * as LoadScript from 'react-load-script';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Announcements from './components/Announcements';
import Footer from './components/Footer';
import Header from './components/Header';
import lazyLoad from './utils/LazyLoad';

import './assets/css/main';

declare const System;
declare const window: any;

const Home = lazyLoad(() => System.import('./pages/Home').then(module => module.default));
const Cards = lazyLoad(() => System.import('./cards/').then(module => module.default));
const Card = lazyLoad(() => System.import('./cards/Card').then(module => module.default));
const About = lazyLoad(() => System.import('./pages/About').then(module => module.default));
const Contact = lazyLoad(() => System.import('./pages/Contact').then(module => module.default));
const FourOhFour = lazyLoad(() => System.import('./pages/404').then(module => module.default));
const Categories = lazyLoad(() =>
  System.import('./categories/Categories').then(module => module.default),
);
const Category = lazyLoad(() =>
  System.import('./categories/Category').then(module => module.default),
);

interface Props {
  location: {
    pathname: string;
  };
}

interface State {
  announcements: boolean;
  addthisLoaded: boolean;
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
      addthisLoaded: false,
    };
  }

  handleScriptLoad() {
    // tslint:disable-next-line:no-console
    console.log('addthis loaded');
    this.setState({ addthisLoaded: true });
    window.addthis.init();
  }

  render() {
    return (
      <div className="row row--stacked main">
        <LoadScript
          url="http://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-4eeb8f2d053a37df"
          onLoad={this.handleScriptLoad.bind(this)}
        />
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(App.structuredData)}</script>
        </Helmet>
        <Header {...this.props} />
        {this.state.announcements && <Announcements />}
        <main className="content container" role="main">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/cards" component={Cards} />
            <Route
              path="/cards/:id"
              render={routeProps => (
                <Card {...routeProps} addThisLoaded={this.state.addthisLoaded} />
              )}
            />
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

export default () => (
  <Router>
    <Route path="/" component={App} />
  </Router>
);
