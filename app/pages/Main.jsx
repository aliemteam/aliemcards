import React, { PropTypes } from 'react';
import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
import Breadcrumbs from 'react-breadcrumbs';

import Search from '../components/Search';

export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      navDrawerOpen: false,
    };
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ navDrawerOpen: !this.state.navDrawerOpen });
  }

  render() {
    const { routes, params, children, location } = this.props;
    return (
      <div className="main">
        <div id="header">
          <button onClick={this.handleClick} id="navtoggle">
            <i className="material-icons">menu</i>
          </button>
          <Link to="/">
            <img src="/assets/images/aliem-cards-logo-horizontal.svg" alt="ALiEM Cards" />
          </Link>
        </div>
        <div id="navmenu" className={this.state.navDrawerOpen ? 'navopen' : 'navclosed'}>
          <ul>
            <li><Link to="/cards">Cards</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <Search hero={location.pathname === '/'} />
        <div className="content container">
          <button className="backButton" onClick={browserHistory.goBack}>&lt; Back</button>
          <Breadcrumbs
            routes={routes}
            params={params}
            separator=" / "
          />
          {children}
        </div>
        <div className="foot">
          <div className="container">
            <div className="cc row">
              <div className="two columns">
                <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/">
                  <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png" />
                </a>
              </div>
              <div className="ten columns">
                This work is licensed under a
                <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/">
                  Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License
                </a>.
              </div>
            </div>
            <ul className="footerLinks">
              <li><a href="/">Questions or Suggestions?</a></li>
              <li><a href="/">Get Involved</a></li>
              <li><Link to="/pages/about">About</Link></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  routes: PropTypes.arrayOf(PropTypes.object),
  params: PropTypes.objectOf(PropTypes.string),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
