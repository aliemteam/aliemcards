import * as React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../utils/Shims';
import Search from './Search';

interface Props {
  location: {
    pathname: string;
  };
}

interface State {
  navDrawerOpen: boolean;
}

export default class Header extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      navDrawerOpen: false,
    };
  }

  handleClick = () => {
    this.setState({ navDrawerOpen: !this.state.navDrawerOpen });
  }

  render() {
    return (
      <div>
        <div className="header" role="banner">
          <div className="header__logo">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <div className="header__nav-button">
            <button
              className={this.state.navDrawerOpen ?
              'hamburger hamburger__squeeze hamburger__squeeze--active' :
              'hamburger hamburger__squeeze'}
              onClick={this.handleClick}
            >
              <span className="hamburger__box">
                <span className="hamburger__inner" />
              </span>
            </button>
          </div>
          <nav
            className={this.state.navDrawerOpen ? 'header__nav header__nav--open' : 'header__nav header__nav--closed'}
            role="navigation"
          >
            <ul>
              <li><a href="https://www.aliem.com/">ALiEM</a></li>
              <li><Link to="/cards" onClick={this.handleClick}>Cards</Link></li>
              <li><Link to="/categories" onClick={this.handleClick}>Categories</Link></li>
              <li><Link to="/about" onClick={this.handleClick}>About</Link></li>
              <li><Link to="/contact" onClick={this.handleClick}>Contact</Link></li>
            </ul>
          </nav>
        </div>
        <Search splashText={this.props.location.pathname === '/'} />
      </div>
    );
  }
}
