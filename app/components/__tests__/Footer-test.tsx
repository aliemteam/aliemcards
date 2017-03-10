jest.mock('react-router-dom');

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Footer from '../Footer';

describe('<Footer />', () => {
  it('should render correctly', () => {
    const component = renderer.create(
      <Footer />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
