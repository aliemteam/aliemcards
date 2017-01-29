import React from 'react';
import renderer from 'react-test-renderer';
import Footer from '../Footer';

jest.mock('react-router');

describe('<Footer />', () => {
  it('should render correctly', () => {
    const component = renderer.create(
      <Footer />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
