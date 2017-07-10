jest.mock('react-router-dom');
jest.mock('../SearchResults');

import { shallow } from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Search from '../Search';

describe('<Search />', () => {
  it('should render correctly', () => {
    const component = renderer.create(<Search splashText={false} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shoulder render splashText when prop is set', () => {
    const component = renderer.create(<Search splashText={true} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should have spinner only when searching', () => {
    jest.useFakeTimers();
    const component = shallow(<Search splashText={false} />);
    expect(component.find('.search__loader').exists()).toBeFalsy();
    component.find('input').simulate('change', { currentTarget: { value: 'hello' } });
    expect(component.find('.search__loader').exists()).toBeTruthy();
    jest.runAllTimers();
  });

  it('should not have spinner if query is empty', () => {
    const component = shallow(<Search splashText={false} />);
    expect(component.find('.search__loader').exists()).toBeFalsy();
    component.find('input').simulate('change', { currentTarget: { value: '' } });
    expect(component.find('.search__loader').exists()).toBeFalsy();
  });

  it('should clear query, uiQuery, and loader with handleClick', () => {
    const component = shallow(<Search splashText={false} />);
    component.find('input').simulate('change', { currentTarget: { value: 'hello' } });
    component.instance().handleClick();
    expect(component.state('loading')).toBe(false);
    expect(component.state('query')).toBe('');
    expect(component.state('uiQuery')).toBe('');
  });
});
