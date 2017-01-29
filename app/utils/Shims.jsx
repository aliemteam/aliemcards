/* eslint-disable */
import React from 'react';

const logo = () => {
  if (__TEST__) {
    return null;
  }
  const LogoComponent = require('svg-react-loader?name=Logo!../assets/images/logo.svg');
  return <LogoComponent />;
};

const ccIcon = () => {
  if (__TEST__) {
    return null;
  }
  const CCIconComponent = require('svg-react-loader?name=CreativeCommonsIcon!../assets/images/by-nc-nd.svg');
  return <CCIconComponent />;
};

export const Logo = logo;
export const CCIcon = ccIcon;
