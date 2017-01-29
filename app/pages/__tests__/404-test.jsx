import React from 'react';
import renderer from 'react-test-renderer';
import FourOhFour from '../404';

describe('<404 />', () => {
  it('should render correctly', () => {
    const component = renderer.create(
      <FourOhFour />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
