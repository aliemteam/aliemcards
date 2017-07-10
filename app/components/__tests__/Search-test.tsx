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

  it('should clear query, uiQuery, and loader with handleClick', () => {
    const component = shallow(<Search splashText={false} />);
    component.find('input').simulate('change', { currentTarget: { value: 'hello' } });
    component.instance().handleClick();
    expect(component.state('query')).toBe('');
    expect(component.state('uiQuery')).toBe('');
  });
});
