import React from 'react';

import TopBar from './topbar';
import NavDrawer from './navdrawer';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.reducer = this.reducer.bind(this);
    this.state = {
      navDrawerOpen: false,
    };
  }

  /**
   * Common reducer function to handle all child events
   * @param  {{type: string, ...rest}} action  Action object
   * @param  {Event}                   e       Event
   * @return {void}
   */
  reducer(action, e) {
    if (e) e.preventDefault();
    switch (action.type) {
      case 'TOGGLE_NAV_DRAWER':
        return this.setState({ navDrawerOpen: !this.state.navDrawerOpen });
      default:
        return null;
    }
  }

  render() {

    let navDrawerOpen = this.state.navDrawerOpen;

    return(
      <div>
        <TopBar
          title="ALIEM Cards"
          events={this.reducer.bind(this)}
        />
        <NavDrawer
          show={this.state.navDrawerOpen}
        />
        {this.props.children}
      </div>
    );
  }
}

export default Main;
