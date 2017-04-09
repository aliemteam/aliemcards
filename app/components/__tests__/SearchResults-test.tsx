jest.mock('react-router-dom');
jest.mock('react-apollo');
jest.mock('react-router-dom');

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import SearchResults from '../SearchResults';


describe('<SearchResults />', () => {
  it('should render correctly', () => {
    const data = {
      "cards": [
        {
            "id": "dvt",
            "title": "DVT of the Leg - ACCP Guidelines"
        },
        {
            "id": "dvt-ultrasound",
            "title": "Ultrasound DVT Assessment"
        },
        {
            "id": "pe-prediction-rules",
            "title": "Pulmonary Embolism Clinical Prediction Rules"
        },
        {
            "id": "ultrasound-measurements",
            "title": "Ultrasound Measurement Cheat Sheet"
        }
      ],
      "networkStatus": 0
    };

    const component = shallow(
      <SearchResults query="test" data={data} onClick={() => console.log('click')} />
    );

    expect(component.find('.search__result').length).toBe(4);

    console.log(component.debug());
  });
});
