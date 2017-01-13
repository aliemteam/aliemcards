import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import Logo from 'svg-react-loader?name=Logo!../assets/images/logo.svg'; // eslint-disable-line

import Search from './Search';

export default class Header extends PureComponent {

  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  }

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
      <div className="header__wrap">
        <div className="header" role="banner">
          <div className="header__logo">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <div className="header__nav-button">
            <button onClick={this.handleClick}>
              <i className="material-icons">
                {this.state.navDrawerOpen ? 'close' : 'menu'}
              </i>
            </button>
          </div>
          <nav
            className={this.state.navDrawerOpen ? 'header__nav header__nav--open' : 'header__nav header__nav--closed'}
            role="navigation"
          >
            <ul>
              <li><Link to="/cards">Cards</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
        </div>
        <Search splashText={this.props.location.pathname === '/'} />
      </div>
    );
  }
}
