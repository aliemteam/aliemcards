jest.mock('react-router-dom');

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import CardList from '../CardList';

const data: any = {
  cards: [
    {
      id: '1',
      categories: [
        {
          id: '1',
          name: 'Test Category',
        },
      ],
      title: 'Test Card',
    },
  ],
  categories: [
    {
      id: '1',
      name: 'Test Category',
    },
  ],
};

const setup = (filter: boolean = false) => {
  const props = { ...data };
  const snapshot = renderer.create(
    <CardList
      cards={props.cards}
      categories={props.categories}
      filterhandler={jest.fn()}
      filter={filter}
      filtervalue=""
    />,
  );
  return {
    snapshot,
  };
};

describe('<CardList />', () => {
  it('should render without filter', () => {
    const { snapshot } = setup();
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
  it('should render with filter', () => {
    const { snapshot } = setup(true);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
