import React from 'react';
import Breadcrumbs from 'react-breadcrumbs';

import TopBar from './topbar';

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
    return (
      <div>
        <TopBar
          title="ALiEM Cards"
          events={this.reducer.bind(this)}
          showNav={this.state.navDrawerOpen}
        />

        <div className="container content">
          <Breadcrumbs
            className="breadcrumbs"
            separator=" / "
            routes={this.props.routes}
            params={this.props.params}
          />
          <div>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  routes: React.PropTypes.object,
  params: React.PropTypes.object,
  children: React.PropTypes.object,
};

Main.defaultProps = {};

export default Main;
