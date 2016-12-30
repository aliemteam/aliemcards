import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Logo from 'svg-react-loader?name=Logo!../assets/images/logo.svg'; // eslint-disable-line

import Search from './Search';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navDrawerOpen: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.setState({ navDrawerOpen: !this.state.navDrawerOpen });
  }

  render() {
    return (
      <div>
        <div id="header">
          <button onClick={this.handleClick} id="navtoggle">
            <i className="material-icons">menu</i>
          </button>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div id="navmenu" className={this.state.navDrawerOpen ? 'navopen' : 'navclosed'}>
          <ul>
            <li><Link to="/cards">Cards</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <Search hero={this.props.location.pathname === '/'} />
      </div>
    );
  }
}

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};
