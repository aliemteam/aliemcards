import React from 'react';

class NavDrawer extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="navdrawer" className={ this.props.show ? 'navopen' : 'navclosed' }>
        <ul>
          <li className="searchbox">
            <form>
              <input type="search" value="Search" />
            </form>
          </li>
          <li><a href="#">Categories</a></li>
          <li><a href="#">Tags</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </div>
    );
  }

};

NavDrawer.propTypes = {
  show: React.PropTypes.bool
};

NavDrawer.defaultProps = {
  show: false
};

export default NavDrawer;
