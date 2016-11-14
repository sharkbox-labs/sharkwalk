import React from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

function handleTouchTap() {
  console.log('onTouchTap triggered on the title component');
}

const Nav = () => (
  <AppBar
    title="SafeWalk"
    onTitleTouchTap={handleTouchTap}
    iconElementRight={<RaisedButton label="Submit" />}
  />
);

export default Nav;
