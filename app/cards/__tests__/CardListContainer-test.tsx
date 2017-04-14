jest.mock('react-apollo');
jest.mock('../CardList');

import { shallow } from 'enzyme';
import * as React from 'react';
import CardListContainer, { Data } from '../CardListContainer';

const mockData: Data = {
  cards: [
    {
      authors: [],
      categories: [{ id: '1', name: 'Category 1' }],
      content: '',
      created: 0,
      id: '1',
      title: 'Test Card',
      updates: null,
    },
    {
      authors: [],
      categories: [{ id: '2', name: 'Category 2' }],
      content: '',
      created: 0,
      id: '2',
      title: 'Other Test Card',
      updates: null,
    },
  ],
  categories: [
    {
      id: '1',
      name: 'Category 1',
    },
    {
      id: '2',
      name: 'Category 2',
    },
  ],
};

const setup = (data?: Data) => {
  const component = shallow(
    <CardListContainer data={data} />,
  );
  return {
    component,
  };
};

describe('<CardListContainer />', () => {
  it('should throw error when no data is given', () => {
    try {
      setup();
    }
    catch (e) {
      expect(e.message).toBe('Component should always receive data');
      return;
    }
    throw new Error('Test should not reach this line');
  });
  it('should apply category filter on change', () => {
    const { component } = setup({ ...mockData });
    expect(component.state().categoryFilter).toBe('');
    expect(component.first().props().cards.length).toBe(2);

    component.instance().handleChange({ currentTarget: { value: '1' }});
    expect(component.state().categoryFilter).toBe('1');
    expect(component.first().props().cards.length).toBe(1);
  });
});
