import React from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


function handleTouchTap() {
  console.log('onTouchTap triggered on the title component');
}

const Nav = props => (
  <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
    <AppBar
      title="SafeWalk"
      onTitleTouchTap={handleTouchTap}
      iconElementRight={<RaisedButton label="Submit" onClick={props.getDirections} />}
    />
  </MuiThemeProvider>
);

Nav.propTypes = {
  getDirections: React.PropTypes.func.isRequired,
};

export default Nav;
