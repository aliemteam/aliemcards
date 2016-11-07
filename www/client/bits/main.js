import React from 'react';
import Breadcrumbs from 'react-breadcrumbs';
import TopBar from './topbar';
import SearchHero from './searchhero';
import Footer from './footer';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      navDrawerOpen: false,
    };
  }

  render() {
    console.log(this.props.routes[0].name);
    return (
      <div className="main">
        <TopBar
          title="ALiEM Cards"
        />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

Main.propTypes = {
  routes: React.PropTypes.array,
  params: React.PropTypes.object,
  children: React.PropTypes.object,
};

Main.defaultProps = {};

export default Main;
