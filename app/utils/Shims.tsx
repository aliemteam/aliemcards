import * as React from 'react';

declare const __TEST__: boolean;

const Thunk: React.SFC = (): null => null;

export const Logo: React.SFC = (): JSX.Element => {
  if (__TEST__) {
    return <Thunk />;
  }
  const LogoComponent = require('../assets/images/logo.svg').default;
  return <LogoComponent />;
};

export const CCIcon: React.SFC = (): JSX.Element => {
  if (__TEST__) {
    return <Thunk />;
  }
  const CCIconComponent = require('../assets/images/by-nc-nd.svg').default;
  return <CCIconComponent />;
};
