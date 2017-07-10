jest.mock('react-router-dom');

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import About from '../About';

describe('<About />', () => {
  it('should render correctly', () => {
    const component = renderer.create(<About />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
