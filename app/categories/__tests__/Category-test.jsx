import React from 'react';
import { mount } from 'enzyme';
import { post } from 'axios';
import Category from '../Category';

jest.mock('react-router-dom');
jest.mock('axios');

const MOCK_RESPONSES = {
  1: {
    cards: [
      {
        id: 'test-card-1',
        title: 'Test Card 1',
        categories: [
          {
            id: 'cat-two',
            name: 'Category Two',
          },
          {
            id: 'cat-one',
            name: 'Category One',
          },
        ],
      }],
    category: {
      id: 'cat-five',
      name: 'Category Five',
    },
  },
  2: {
    cards: [
      {
        id: 'test-card-2',
        title: 'Test Card 2',
        categories: [
          {
            id: 'cat-two',
            name: 'Category Two',
          },
          {
            id: 'cat-three',
            name: 'Category Three',
          },
        ],
      },
      {
        id: 'test-card-1',
        title: 'Test Card 1',
        categories: [
          {
            id: 'cat-two',
            name: 'Category Two',
          },
          {
            id: 'cat-one',
            name: 'Category One',
          },
        ],
      },
    ],
    category: {
      id: 'cat-two',
      name: 'Category Two',
    },
  },
};

const selectMockData = x =>
  new Promise(res => res({ status: 200, data: { data: MOCK_RESPONSES[x] } }));

const setup = () => {
  const component = mount(
    <Category params={{ category: 'test-category-id' }} />
  );
  return component;
};

describe('<Category />', () => {
  it('should have title from API not card', async () => {
    post.mockReturnValueOnce(selectMockData(1));
    const component = await setup();
    const title = component.find('h1').text();
    expect(title).toBe('Category Five');
  });

  it('should have a single CardList component', async () => {
    post.mockReturnValueOnce(selectMockData(1));
    const component = await setup();
    const cardlist = component.find('.card-list');
    expect(cardlist.length).toBe(1);
  });

  it('should refetch from API when category param changes', async () => {
    const catSpy = spyOn(Category.prototype, 'getCategory').and.callThrough();
    post
      .mockReturnValueOnce(selectMockData(1))
      .mockReturnValueOnce(selectMockData(2));
    const component = await setup();
    component.setProps({ params: { category: 'cat-two' } });
    expect(catSpy).toHaveBeenCalledTimes(2);
  });

  it('should NOT refetch from API if new props match old props', async () => {
    const catSpy = spyOn(Category.prototype, 'getCategory').and.callThrough();
    post.mockReturnValueOnce(selectMockData(1));
    const component = await setup();
    component.setProps({ params: { category: 'test-category-id' } });
    expect(catSpy).toHaveBeenCalledTimes(1);
  });

  it('should catch axios promise rejections', async () => {
    const consoleSpy = spyOn(console, 'error').and.callThrough();
    post.mockReturnValueOnce(Promise.reject('rejected'));
    setup();
    process.nextTick(() => { expect(consoleSpy).toHaveBeenCalled(); });
  });

  it('should handle API error codes', async () => {
    const consoleSpy = spyOn(console, 'error').and.callThrough();
    post.mockReturnValueOnce(Promise.resolve({ status: 500 }));
    setup();
    process.nextTick(() => { expect(consoleSpy).toHaveBeenCalled(); });
  });
});
