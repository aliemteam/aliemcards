import * as React from 'react';
import CardListContainer from './CardListContainer';

export default (): JSX.Element => (
  <div>
    <h1>Cards</h1>
    <CardListContainer filter />
  </div>
);
