/* eslint-disable import/first */
jest.mock('axios');

import React from 'react';
import { mount } from 'enzyme';
import { post } from 'axios';
import Category from '../Category';

const MOCK_RESPONSES = [
  {
    cards: [
      {
        id: 'test-card-1',
        title: 'Test Card 1',
        categories: [
          {
            id: 'cat-one',
            name: 'Category One',
          },
        ],
      }],
    category: {
      id: 'cat-one',
      name: 'Category One',
    },
  },
];

const selectMockData = x =>
  new Promise(res => res({ status: 200, data: { data: MOCK_RESPONSES[x] } }));

const setup = () => {
  const component = mount(
    <Category params={{ category: 'test-category-id' }} />
  );
  return component;
};

describe('<Category />', () => {
  let mocking;

  beforeEach(() => {
    mocking = false;
  });
  afterEach(() => { mocking = false; });

  it('should mock axios', async () => {
    post.mockImplementation(() => {
      mocking = true;
      return selectMockData(0);
    });
    mount(<Category params={{ category: 'ebm' }} />);
    expect(mocking).toBe(true);
  });

  it('should have a proper title', async () => {
    post.mockImplementation(() => selectMockData(0));
    const component = await setup();
    const title = component.find('h1').text();
    expect(title).toBe('Category One');
  });

  it('should have a single CardList component', async () => {
    post.mockImplementation(() => selectMockData(0));
    const component = await setup();
    console.log(component.debug());
    expect(component.find('.card-list')).to.have.length(1);
  });

});
