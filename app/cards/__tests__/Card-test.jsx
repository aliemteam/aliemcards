/* eslint-disable import/first */
jest.mock('axios');

import React from 'react';
import { mount } from 'enzyme';
import Card from '../Card';
import axios from 'axios';


const setup = () => {
  const component = mount(
    <Card params={{ id: 'test-card-id' }} />
  );
  return {
    component,
  };
};

describe('<Card />', () => {
  let MOCK_RESPONSE;
  beforeEach(() => {
    MOCK_RESPONSE = {
      status: 200,
      data: {
        data: {
          card: {
            id: 'test-card-id',
            title: 'Test Card',
            authors: ['John Doe'],
            created: 1262062800000,
            updates: null,
            content: '## Hello World',
          },
        },
      },
    };
  });
  it('should render appropriately with one author', async () => {
    spyOn(axios, 'post').and.callFake(() => new Promise(res => res(MOCK_RESPONSE)));
    const { component } = await setup();
    const title = component.find('h1').props().children;
    const authorString = component.find('.card__meta').children().first().text();
    const updatedString = component.find('.card__meta').children().last().text();
    const cardContent = component.find('.card__content').html();

    expect(title).toBe('Test Card');
    expect(authorString).toBe('Author: John Doe');
    expect(updatedString).toBe('Updated: 12/29/2009');
    expect(cardContent).toBe('<div class="card__content"><h2 id="hello-world">Hello World</h2>\n</div>');
  });
  it('should render appropriately with multiple authors', async () => {
    MOCK_RESPONSE.data.data.card.authors = ['John Doe', 'Jane Doe', 'Bob Smith'];
    spyOn(axios, 'post').and.callFake(() => new Promise(res => res(MOCK_RESPONSE)));
    const { component } = await setup();
    const authorString = component.find('.card__meta').children().first().text();

    expect(authorString).toBe('Authors: John Doe, Jane Doe, Bob Smith');
  });
  it('should re-render when new props are received', async () => {
    let called = false;
    const SECOND_RESPONSE = {
      status: 200,
      data: {
        data: {
          card: {
            ...MOCK_RESPONSE.data.data.card,
            title: 'New Card Title',
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
    const title = component.find('h1').props().children;
    expect(title).toBe('Test Card');

    component.setProps({ params: { id: 'new-card-id' } }, () => {
      process.nextTick(() => {
        expect(component.find('h1').props().children).toBe('New Card Title');
      });
    });
  });
  it('should skip re-rendering if new props match old props', async () => {
    spyOn(axios, 'post').and.callFake(() => new Promise(res => res(MOCK_RESPONSE)));
    const { component } = await setup();
    const title = component.find('h1').props().children;

    expect(title).toBe('Test Card');
    component.setProps({ params: { id: 'test-card-id' } }, () => {
      process.nextTick(() => {
        expect(component.find('h1').props().children).toBe('Test Card');
      });
    });
  });
  it('should handle API errors', async () => {
    MOCK_RESPONSE.status = 500;
    spyOn(axios, 'post').and.callFake(() => new Promise(res => res(MOCK_RESPONSE)));
    const { component } = await setup();
    const title = component.find('h1').props().children;

    expect(title).toBe('');
  });
});
