import React from 'react';

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
    return(
      <div id="header">
        <a onClick={this.toggleNavTap} id="navtoggle" ><i className="material-icons">menu</i></a>
        <h1><a href="index.html">{this.props.title}</a></h1>
      </div>
    );
  }

};

TopBar.propTypes = {
  title: React.PropTypes.string,
  events: React.PropTypes.func,
};

TopBar.defaultProps = {

};

export default TopBar;
