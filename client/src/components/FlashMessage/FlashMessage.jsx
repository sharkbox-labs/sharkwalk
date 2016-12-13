import React, { Component } from 'react';

const containerStyle = {
  positon: 'fixed',
  top: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundColor: '000000',
  zIndex: 5,
};

const textStyle = {
  transition: 'opacity 0.5s',
};

class FlashMessage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      flashText: '',
      textOpacity: 0,
    };
    this.resizeDiv = this.resizeDiv.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeDiv);
  }

  resizeDiv() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  flashText(text, duration = 3) {
    this.setState({ flashText: text, textOpacity: 1 });
    setTimeout(() => {
      this.setState({ textOpacity: 0 });
    }, duration * 1000);
  }

  render() {
    return (
      <div
        style={Object.assign({}, containerStyle, {
          width: this.state.width,
          height: this.state.height,
        })}
      >
        <h1
          className="flash-text"
          style={Object.assign({}, textStyle, this.props.textStyle, { opacity: this.state.textOpacity })}
        >{this.state.flashText}</h1>
      </div>
    );
  }
}

FlashMessage.propTypes = {
  textStyle: React.PropTypes.object, // eslint-disable-line
};

export default FlashMessage;
