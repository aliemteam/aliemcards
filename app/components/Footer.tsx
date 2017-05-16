import * as React from 'react';
import { Link } from 'react-router-dom';
import { CCIcon } from '../utils/Shims';

export default () => (
  <div className="footer" role="contentinfo">
    <div className="row footer__cc">
      <div className="footer__cc-image">
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/">
          <CCIcon />
        </a>
      </div>
      <div className="footer__cc-text">
        This work is licensed under a{' '}
        <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/">
          Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License
        </a>.
      </div>
    </div>
    <div className="row footer__links">
      <div><Link to="/contact">Contact</Link></div>
      <div><Link to="/contact">Get Involved</Link></div>
      <div><Link to="/about">About</Link></div>
    </div>
  </div>
);
