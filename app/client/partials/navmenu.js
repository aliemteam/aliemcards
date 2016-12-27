import React from 'react';
import { Link } from 'react-router';

const NavMenu = ({ showNav }) =>
  <div id="navmenu" className={showNav ? 'navopen' : 'navclosed'}>
    <ul>
      <li><Link to="/cards">Cards</Link></li>
      <li><Link to="/categories">Categories</Link></li>
      <li><Link to="/pages/about">About</Link></li>
    </ul>
  </div>;

NavMenu.propTypes = {
  showNav: React.PropTypes.bool,
};

export default NavMenu;
