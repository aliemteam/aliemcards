jest.mock('react-apollo');

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Card as CardType } from '../../../server/models/card/cardType';
import Card from '../Card';

const stub: any = {};

const setup = (networkStatus = 7, cardData?: Partial<CardType>) => {
  const card: any = {
    authors: [
      {
        id: '1',
        name: 'John Doe',
        cards: [],
      },
    ],
    categories: [
      {
        id: '1',
        name: 'test',
      },
    ],
    content: '# Hello World',
    created: 1483228800000, // ​​​​​Sun, 01 Jan 2017 00:00:00 GMT​​​​​
    id: '1',
    title: 'Test Card',
    updates: null,
    ...cardData,
  };
  const snapshot = renderer.create(<Card data={{ card, networkStatus }} match={stub} />);
  return {
    snapshot,
  };
};

describe('<Card />', () => {
  it('should render according to networkStatus', () => {
    const { snapshot: loading } = setup(1);
    expect(loading.toJSON()).toMatchSnapshot();

    const { snapshot: polling } = setup(6);
    expect(polling.toJSON()).toMatchSnapshot();

    const { snapshot: rendered } = setup();
    expect(rendered.toJSON()).toMatchSnapshot();
  });
  it('should render with multiple authors and updated date', () => {
    const card: Partial<CardType> = {
      authors: [
        {
          id: '1',
          name: 'John Doe',
          cards: [],
        },
        {
          id: '2',
          name: 'Jane Doe',
          cards: [],
        },
      ],
      updates: [1483228800000],
    };
    const { snapshot } = setup(7, card);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });
});
