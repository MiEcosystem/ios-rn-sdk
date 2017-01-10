'use strict';

var  React  = require('react-native');

var {
  Dimensions,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Image,
  PixelRatio,
  Text
} = React;

var propTypes = {
  source: React.PropTypes.object,
  highlightedSource: React.PropTypes.object,
  onPress: React.PropTypes.func,
};

var ImageButton = React.createClass({
  propTypes: propTypes,

  getInitialState: function() {
    return {
      buttonPressed: false,
    };
  },

  getDefaultProps: function() {
    return {
      image: null,
      highlightedImage: null,
      onPress: null,
    };
  },

  _buttonPressIn: function() {
    this.setState({ buttonPressed: true });
  },

  _buttonPressOut: function() {
    this.setState({ buttonPressed: false });
  },

  _isButtonPressed: function() {
    return this.state.buttonPressed;
  },

  render: function() {
    var source = this.props.source;
    if (this._isButtonPressed() && this.props.highlightedSource) {
      source = this.props.highlightedSource;
    }
    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        onPressIn={this._buttonPressIn}
        onPressOut={this._buttonPressOut}>
          <Image
            style={this.props.style}
            source={source}/>
      </TouchableWithoutFeedback>
    );
  },
});

module.exports = ImageButton;
