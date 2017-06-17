jest.mock('../../cards/CardList');
jest.mock('react-apollo');

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Home from '../Home';

const data: any = {
  recentlyAdded: [],
  recentlyUpdated: [],
};

describe('<Home />', () => {
  it('should work with 0 length cards', () => {
    const component = renderer.create(<Home data={data} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
  it('should work', () => {
    const d: any = {};
    const component = renderer.create(<Home data={d} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
