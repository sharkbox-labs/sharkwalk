import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import RiskPath from './RiskPath';

let wrapper;

describe('<RiskPath />', () => {
  beforeEach(() => {
    // eslint-disable-next-line
    wrapper = shallow(<RiskPath />);
  });

  it('should have a componentWillMount method', () => {
    // eslint-disable-next-line
    expect(wrapper.componentWillMount).to.be.defined;
  });

  it('should have a renderRiskPath method', () => {
    // eslint-disable-next-line
    expect(wrapper.renderRiskPath).to.be.defined;
  });
});
