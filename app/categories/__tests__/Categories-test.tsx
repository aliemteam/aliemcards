jest.mock('react-apollo');
jest.mock('react-router-dom');

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Categories from '../Categories';

const mockData = [
  {
    id: 'test-category-1',
    name: 'Test Category 1',
  },
  {
    id: 'test-category-2',
    name: 'Test Category 2',
  },
];

const setup = (categories: any = [...mockData]) => {
  const data = {
    categories,
  };
  const snapshot = renderer.create(<Categories data={data} />);
  return {
    snapshot,
  };
};

describe('<Categories />', () => {
  it('should render appropriately', () => {
    const { snapshot: withCategories } = setup();
    expect(withCategories.toJSON()).toMatchSnapshot();

    const { snapshot: withoutCategories } = setup(null);
    expect(withoutCategories.toJSON()).toMatchSnapshot();
  });
});
