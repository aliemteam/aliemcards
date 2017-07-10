jest.mock('react-apollo');
jest.mock('../../cards/CardList');

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import CardList from '../../cards/CardList';
import Category, { Data } from '../Category';

(CardList as any).mockImplementation(() => <div>Mocked CardList</div>);

const stub: any = {};
const mockData = {
  category: {
    id: 'test-category',
    name: 'Test Category',
  },
  networkStatus: 1,
};

const setup = (networkStatus: number = 1, cards: any = []) => {
  const data: Data = {
    ...mockData,
    cards,
    networkStatus,
  };
  const snapshot = renderer.create(<Category data={data} match={stub} />);
  return {
    snapshot,
  };
};

describe('<Category />', () => {
  it('should render appropriately depending on networkStatus', () => {
    const { snapshot: loading } = setup();
    expect(loading.toJSON()).toMatchSnapshot();

    const { snapshot: polling } = setup(6);
    expect(polling.toJSON()).toMatchSnapshot();

    const { snapshot: withCards } = setup(7);
    expect(withCards.toJSON()).toMatchSnapshot();

    const { snapshot: withoutCards } = setup(7, null);
    expect(withoutCards.toJSON()).toMatchSnapshot();
  });
});
