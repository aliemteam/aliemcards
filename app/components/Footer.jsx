import React from 'react';
import { Link } from 'react-router';
import CreativeCommonsIcon from 'svg-react-loader?name=CreativeCommonsIcon!../assets/images/by-nc-nd.svg'; // eslint-disable-line

export default () => (
  <div className="footer">
    <div className="row footer__cc">
      <div className="footer__cc-image">
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/">
          <CreativeCommonsIcon />
        </a>
      </div>
      <div className="footer__cc-text">
        This work is licensed under a
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/">
          {' '}Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License
        </a>.
      </div>
    </div>
    <div className="row footer__links">
      <div><a href="/">Questions or Suggestions?</a></div>
      <div><a href="/">Get Involved</a></div>
      <div><Link to="/about">About</Link></div>
    </div>
  </div>
);
