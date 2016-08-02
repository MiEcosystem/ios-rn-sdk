// MHCircularSlider.js

var React = require('react-native');
var MHCircularSliderViewManager = require('NativeModules').MHWrapperCircularSlider;
var findNodeHandle = require('findNodeHandle');
var { requireNativeComponent,
      DeviceEventEmitter,
    } = React; 
var MHWrapperCircularSlider = requireNativeComponent('MHWrapperCircularSlider');

class MHCircularSlider extends React.Component {
  constructor(props) {
    super(props);
    var MHCircularSliderConsts = MHWrapperCircularSlider.Constants;
    this.consts = MHCircularSliderConsts;
  }

  setValue(newValue) {
    this._slider.setNativeProps({value:newValue});
  }

  getValueWithCallback(callback) {
    MHCircularSliderViewManager.getValueWithCallback(findNodeHandle(this), callback);
  }

  //设置开关
  setPower(power, value) {
    MHCircularSliderViewManager.setPower(findNodeHandle(this), power, value);
  }

  render() {
    return <MHWrapperCircularSlider ref={component => {this._slider = component;}} {...this.props} />;
  }
}

MHCircularSlider.propTypes = {
  value: React.PropTypes.number,
  minimumValue: React.PropTypes.number,
  maximumValue: React.PropTypes.number,
  sliderName: React.PropTypes.string,
};

module.exports = MHCircularSlider;
