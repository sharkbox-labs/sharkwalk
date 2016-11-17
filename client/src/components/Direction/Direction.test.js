import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import Direction from './Direction';

let wrapper;

describe('<Direction />', () => {
  beforeEach(() => {
    // eslint-disable-next-line
    wrapper = shallow(<Direction />);
  });

  it('should not have a componentWillMount method', () => {
    // eslint-disable-next-line
    expect(wrapper.componentWillMount).to.be.defined;
  });

  it('should have a renderDirection method', () => {
    // eslint-disable-next-line
    expect(wrapper.renderDirection).to.be.defined;
  });
});
