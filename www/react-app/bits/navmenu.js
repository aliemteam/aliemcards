import React from 'react';

const NavMenu = ({ showNav }) =>
  <div id="navmenu" className={showNav ? 'navopen' : 'navclosed'}>
    <ul>
      <li><a href="/cards">Cards</a></li>
      <li><a href="/categories">Categories</a></li>
      <li><a href="/tags">Tags</a></li>
      <li><a href="/Search">Search</a></li>
    </ul>
  </div>;

NavMenu.propTypes = {
  showNav: React.PropTypes.bool,
};

NavMenu.defaultProps = {};

export default NavMenu;
