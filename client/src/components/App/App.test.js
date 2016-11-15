import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { expect } from 'chai';
import App from './App';

describe('<App />', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');
    // eslint-disable-next-line
    ReactDOM.render(<App />, div);
  });

  it('should have an initial origin state', () => {
    const wrapper = mount('<App />');
    expect(wrapper.state().origin).to.equal('');
  });
});
