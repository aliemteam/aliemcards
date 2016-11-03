import React from 'react';

import NavMenu from './navmenu';
import Search from './search';

class TopBar extends React.Component {

  constructor(props) {
    super(props);
    this.toggleNavTap = this.toggleNavTap.bind(this);
  }

  toggleNavTap(e) {
    e.preventDefault();
    this.props.events({ type: 'TOGGLE_NAV_DRAWER' });
  }

  render() {
    return (
      <div>
        <div id="header">
          <a onClick={this.toggleNavTap} id="navtoggle" ><i className="material-icons">menu</i></a>
          <a href="/">
            <img src="/images/aliem-cards-logo-horizontal.svg" alt={this.props.title} />
          </a>
        </div>
        <NavMenu showNav={this.props.showNav} />
        <Search />
      </div>
    );
  }
}

TopBar.propTypes = {
  title: React.PropTypes.string,
  events: React.PropTypes.func,
  showNav: React.PropTypes.bool,
};

TopBar.defaultProps = {};

export default TopBar;
