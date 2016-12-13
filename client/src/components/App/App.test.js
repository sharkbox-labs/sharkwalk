import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import App from './App';

let wrapper;

describe('<App />', () => {
  beforeEach(() => {
    // eslint-disable-next-line
    wrapper = shallow(<App />);
  });

  it('should render without crashing', () => {
    const div = document.createElement('div');
    // eslint-disable-next-line
    ReactDOM.render(<App />, div);
  });

  xit('should have a Map child', () => {
    // eslint-disable-next-line
    expect(wrapper.renderOriginMarker).to.be.defined;
  });

  it('should have a renderOriginMarker method', () => {
    // eslint-disable-next-line
    expect(wrapper.renderOriginMarker).to.be.defined;
  });

  it('should have a getDirections method', () => {
    // eslint-disable-next-line
    expect(wrapper.getDirections).to.be.defined;
  });
});
