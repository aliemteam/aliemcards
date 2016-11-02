import React from 'react';

const NavDrawer = ({ show }) => {
  return (
    <div id="navdrawer" className={show ? 'navopen' : 'navclosed'}>
      <ul>
        <li className="searchbox">
          <form>
            <input type="search" value="Search" />
          </form>
        </li>
        <li><a href="/cards">Cards</a></li>
        <li><a href="/categories">Categories</a></li>
        <li><a href="/tags">Tags</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </div>
  );
};

NavDrawer.propTypes = {
  show: React.PropTypes.bool
};

NavDrawer.defaultProps = {
  show: false
};

export default NavDrawer;
