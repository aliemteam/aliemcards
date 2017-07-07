jest.mock('react-router-dom');
jest.mock('react-apollo');

import { shallow } from 'enzyme';
import * as React from 'react';
import { Link } from 'react-router-dom';
import SearchResults from '../SearchResults';

interface Card {
  id: string;
  title: string;
}

const click = jest.fn();
const defaultCards = [
  {
      id: 'dvt',
      title: 'DVT of the Leg - ACCP Guidelines',
  },
  {
      id: 'dvt-ultrasound',
      title: 'Ultrasound DVT Assessment',
  },
  {
      id: 'pe-prediction-rules',
      title: 'Pulmonary Embolism Clinical Prediction Rules',
  },
  {
      id: 'ultrasound-measurements',
      title: 'Ultrasound Measurement Cheat Sheet',
  },
];

const setup = (cards: Card[] = defaultCards) => {
  const data = {
    cards,
    networkStatus: 0,
  };
  const component = shallow(
    <SearchResults query="test" data={data} onClick={click} />,
  );
  return {
    component,
  };
};

const setupLoading = () => {
  const data = {
    cards: [],
    networkStatus: 1,
  };
  const component = shallow(
    <SearchResults query="test" data={data} onClick={click} />,
  );
  return {
    component,
  };
};

const setupNoQuery = () => {
  const data = {
    cards: [],
    networkStatus: 0,
  };
  const component = shallow(
    <SearchResults query="" data={data} onClick={click} />,
  );
  return {
    component,
  };
};

const setupNoResults = () => {
  const data = {
    cards: [],
    networkStatus: 7,
  };
  const component = shallow(
    <SearchResults query="test" data={data} onClick={click} />,
  );
  return {
    component,
  };
};

describe('<SearchResults />', () => {
  it('should render correctly', () => {
    const { component } = setup();
    expect(component.find('.search__result').length).toBe(4);
    expect(component.find(Link).get(0).props.children).toBe('DVT of the Leg - ACCP Guidelines');
    expect(component.find(Link).get(1).props.children).toBe('Ultrasound DVT Assessment');
    expect(component.find(Link).get(2).props.children).toBe('Pulmonary Embolism Clinical Prediction Rules');
    expect(component.find(Link).get(3).props.children).toBe('Ultrasound Measurement Cheat Sheet');
  });
  it('should throw an error if no data is available', () => {
    const { component } = setup();
    try {
      component.setProps({data: null});
    }
    catch (err) {
      expect(err.message).toBe('Data should always be available');
      return;
    }
    throw new Error('Test should not reach this point');
  });
  it('should use the onClick function passed in props', () => {
    const { component } = setup();
    expect(component.find(Link).get(0).props.onClick).toBe(click);
  });
  it('should have spinner only when query exists and networkStatus < 7', () => {
    const { component } = setupLoading();
    expect(component.find('.search__loader').exists()).toBeTruthy();
  });
  it('should not have spinner if query is empty', () => {
    const { component } = setupNoQuery();
    expect(component.find('.search__loader').exists()).toBeFalsy();
  });
  it('should return no results if no results and done loading', () => {
    const { component } = setupNoResults();
    expect(component.find('.search__loader').exists()).toBeFalsy();
    expect(component.find('.search__noresult').exists()).toBeTruthy();
  });

});
