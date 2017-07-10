import * as React from 'react';

declare const __TEST__: boolean;

const Thunk: any = () => null;

export const Logo: React.SFC<{}> = () => {
  if (__TEST__) {
    return <Thunk />;
  }
  const LogoComponent = require('babel-loader!react-svg-loader!../assets/images/logo.svg').default;
  return <LogoComponent />;
};

export const CCIcon: React.SFC<{}> = () => {
  if (__TEST__) {
    return <Thunk />;
  }
  const CCIconComponent = require('babel-loader!react-svg-loader!../assets/images/by-nc-nd.svg')
    .default;
  return <CCIconComponent />;
};
