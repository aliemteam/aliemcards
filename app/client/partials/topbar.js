import React from 'react';

import NavMenu from './navmenu';
import Search from './search';

class TopBar extends React.Component {

  constructor(props) {
    super(props);
    this.toggleNavTap = this.toggleNavTap.bind(this);
    this.state = {
      navDrawerOpen: false,
    };
  }

  toggleNavTap(e) {
    e.preventDefault();
    this.setState({ navDrawerOpen: !this.state.navDrawerOpen });
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
        <NavMenu showNav={this.state.navDrawerOpen} />
      </div>
    );
  }
}

TopBar.propTypes = {
  title: React.PropTypes.string,
};

export default TopBar;
