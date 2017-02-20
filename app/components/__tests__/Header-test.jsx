import React from 'react';
import { mount } from 'enzyme';
import Header from '../Header';

jest.mock('react-router-dom');

const setup = () => {
  const component = mount(
    <Header location={{ pathname: 'testing' }} />
  );
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
    const { button, nav } = setup();
    expect(button.hasClass('hamburger__squeeze--active')).toBe(false);
    expect(nav.hasClass('header__nav--open')).toBe(false);

    button.simulate('click');
    expect(button.hasClass('hamburger__squeeze--active')).toBe(true);
    expect(nav.hasClass('header__nav--open')).toBe(true);

    button.simulate('click');
    expect(button.hasClass('hamburger__squeeze--active')).toBe(false);
    expect(nav.hasClass('header__nav--open')).toBe(false);
  });
});
