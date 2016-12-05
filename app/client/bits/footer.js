import React from 'react';
import { Link } from 'react-router';

const Footer = () =>
  <div className="foot">
    <div className="container">
      <div className="cc row">
        <div className="two columns"><a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/"><img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-nc-nd/3.0/88x31.png" /></a></div>
        <div className="ten columns">This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/3.0/">Creative Commons Attribution-NonCommercial-NoDerivs 3.0 Unported License</a>.</div>
      </div>
      <ul className="footerLinks">
        <li><a href="#">Questions or Suggestions?</a></li>
        <li><a href="#">Get Involved</a></li>
        <li><Link to="/pages/about">About</Link></li>
      </ul>
    </div>
  </div>;

export default Footer;
