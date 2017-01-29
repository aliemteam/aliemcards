import React from 'react';
import renderer from 'react-test-renderer';
import Spinner from '../Spinner';

describe('<Spinner />', () => {
  it('should render correctly', () => {
    const component = renderer.create(
      <Spinner />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
