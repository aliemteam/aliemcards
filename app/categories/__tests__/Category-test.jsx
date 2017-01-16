/* eslint-disable import/first */
jest.mock('axios');

import React from 'react';
import { mount } from 'enzyme';
import Category from '../Category';
import axios from 'axios';


const setup = () => {
  const component = mount(
    <Category params={{ category: 'cat-one' }} />
  );
  return {
    component,
  };
};

describe('<Category />', () => {
  let MOCK_RESPONSE;
  beforeEach(() => {
    MOCK_RESPONSE = {
      status: 200,
      data: {
        data: {
          category: {
            id: 'cat-one',
            name: 'Category One',
          },
          cards: [
            {
              id: 'test-card-one',
              title: 'Test Card 1',
              categories: [
                { id: 'cat-two', name: 'Category Two' },
                { id: 'cat-one', name: 'Category One' },
              ],
            },
            {
              id: 'test-card-two',
              title: 'Test Card 2',
              categories: [
                { id: 'cat-one', name: 'Category One' },
                { id: 'cat-three', name: 'Category Three' },
              ],
            },
          ],
        },
      },
    };
  });
  it('should render title with initial category', async () => {
    spyOn(axios, 'post').and.callFake(() => new Promise(res => res(MOCK_RESPONSE)));
    const { component } = await setup();
    const title = component.find('h1').text();
    expect(title).toBe('Category One');
  });
  it('should render new title with change of category', async () => {
    let called = false;
    const SECOND_RESPONSE = {
      status: 200,
      data: {
        data: {
          cards: [...MOCK_RESPONSE.data.data.cards],
          category: {
            id: 'cat-five',
            name: 'Category Five',
          },
        },
      },
    };
    spyOn(axios, 'post').and.callFake(() => {
      if (!called) {
        called = true;
        return new Promise(res => res(MOCK_RESPONSE));
      }
      return new Promise(res => res(SECOND_RESPONSE));
    });
    const { component } = await setup();
    const title = component.find('h1').text();
    expect(title).toBe('Category One');
    // component.setProps({ params: { category: 'cat-five' } });
    // component.setProps({ params: { category: 'cat-five' } }, () => {
    //   process.nextTick(() => {
    //     expect(component.find('h1').text()).toBe('Category Five');
    //   });
    // });
  });
});
