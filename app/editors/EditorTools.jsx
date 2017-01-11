import React from 'react';
import { Link } from 'react-router';

export default () => (
  <div className="content">
    <h1>Editors Tools</h1>
    <p>
      A few tools to help keep the cards up to date.
    </p>
    <ul>
      <li><Link to="/editortools/neverupdated">Never Updated Cards</Link></li>
    </ul>
  </div>
);
