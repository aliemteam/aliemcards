import React from 'react';
import { Link } from 'react-router';
import CreativeCommonsIcon from 'svg-react-loader?name=CreativeCommonsIcon!../assets/images/by-nc-nd.svg'; // eslint-disable-line

export default () => (
  <div className="foot">
    <div className="container">
      <div className="cc row">
        <div className="two columns">
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/">
            <CreativeCommonsIcon />
          </a>
        </div>
        <div className="ten columns">
          This work is licensed under a
          <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/">
            Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License
          </a>.
        </div>
      </div>
      <ul className="footerLinks">
        <li><a href="/">Questions or Suggestions?</a></li>
        <li><a href="/">Get Involved</a></li>
        <li><Link to="/pages/about">About</Link></li>
      </ul>
    </div>
  </div>
);
