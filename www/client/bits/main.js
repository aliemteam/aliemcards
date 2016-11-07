import React from 'react';
import Breadcrumbs from 'react-breadcrumbs';
import TopBar from './topbar';
import Search from './search';
import Footer from './footer';

class Main extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="main">
        <TopBar
          title="ALiEM Cards"
        />
        <Search />
        <div className="content container">
          <Breadcrumbs
            routes={this.props.routes}
            params={this.props.params}
            separator=" / "
          />
          {this.props.children}
        </div>
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
