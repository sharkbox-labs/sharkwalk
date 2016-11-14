import React from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';


function handleTouchTap() {
  console.log('onTouchTap triggered on the title component');
}

const Nav = props => (
  <AppBar
    title="SafeWalk"
    onTitleTouchTap={handleTouchTap}
    iconElementRight={<RaisedButton label="Submit" onClick={props.getDirections} />}
  />
);

Nav.propTypes = {
  getDirections: React.PropTypes.func.isRequired,
};

export default Nav;
