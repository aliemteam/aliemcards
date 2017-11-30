jest.mock('react-router-dom');
jest.mock('../Search');

import { mount } from 'enzyme';
import * as React from 'react';
import Header from '../Header';

const setup = () => {
  const component = mount(<Header location={{ pathname: 'testing' }} />);
  return {
    button: component.find('button'),
    component,
    nav: component.find('nav'),
  };
};

describe('<Header />', () => {
  it('should render with menu closed', () => {
    const { button, nav } = setup();
    expect(button.hasClass('hamburger__squeeze--active')).toBe(false);
    expect(nav.hasClass('header__nav--open')).toBe(false);
  });
  it('should toggle the menu on click', () => {
    const { component } = setup();

    expect(component.find('button').hasClass('hamburger__squeeze--active')).toBe(false);
    expect(component.find('nav').hasClass('header__nav--open')).toBe(false);

    component.find('button').simulate('click');
    expect(component.find('button').hasClass('hamburger__squeeze--active')).toBe(true);
    expect(component.find('nav').hasClass('header__nav--open')).toBe(true);

    component.find('button').simulate('click');
    expect(component.find('button').hasClass('hamburger__squeeze--active')).toBe(false);
    expect(component.find('nav').hasClass('header__nav--open')).toBe(false);
  });
});
