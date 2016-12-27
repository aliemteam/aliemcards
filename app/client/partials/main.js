import React from 'react';
import Breadcrumbs from 'react-breadcrumbs';
import TopBar from './topbar';
import Search from './search';
import BackButton from './back-button';
import Footer from './footer';

const Main = ({ routes, params, children }) => (
  <div className="main">
    <TopBar
      title="ALiEM Cards"
    />
    <Search />
    <div className="content container">
      <BackButton />
      <Breadcrumbs
        routes={routes}
        params={params}
        separator=" / "
      />
      {children}
    </div>
    <Footer />
  </div>
);

Main.propTypes = {
  routes: React.PropTypes.array,
  params: React.PropTypes.object,
  children: React.PropTypes.object,
};

export default Main;
