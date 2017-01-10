/**
 * 通用的Button控件
 *
 * 引用：var Button = require('../CommonModules/Button');
 *
 * 使用演示示例：
 * <Button onPress={this._handlePress} title="测试"
 *   imageNormal="RemoteControlInfo/remote_home_normal.png" imageHighlight="RemoteControlInfo/remote_home_pressed.png"
 *   imageWidth={64} imageHeight={64} titleSize={14}/>
 *
 * 参数说明：
   isOn: PropTypes.bool,
   title: PropTypes.string,
   description: PropTypes.string,
   key: PropTypes.string,
   disabled: PropTypes.bool,
   showLine: PropTypes.bool,
   onSwitchChange: PropTypes.func,
 */
 'use strict';

var React = require('react-native');

var {
  PropTypes,
  StyleSheet,
  Text,
  TouchableHighlight,
  Component,
  View,
} = React;

var MHAutoSizeScale = require('../Tools/MHAutoSizeScale');
var PowerSwitch = require('../Views/PowerSwitch');


class SingleLineSwitchCell extends Component {
    constructor(props) {
        super(props);

        this.state = {
          ...TouchableHighlight.propTypes,
          disabled: this.props.disabled,
          isOn: this.props.isOn,
          title: this.props.title,
          description: this.props.description,
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    _switchIsOn(isOn){
      if (this.props.onSwitchChange) {
        this.props.onSwitchChange(isOn);
      }
    }

    render() {
      return (
        <View style={this.props.style}>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{this.state.title}</Text>
              <Text style={styles.description}>{this.state.description}</Text>
            </View>
            <View style={styles.switchView}>
              <PowerSwitch
              onChangeState={(state) => this._switchIsOn(state)}
              style={{marginBottom: 10*MHAutoSizeScale.AutosizeScale1080x1920}}
              switchWidth= {90*MHAutoSizeScale.AutosizeScale1080x1920}
              switchHeight= {45*MHAutoSizeScale.AutosizeScale1080x1920}
              buttonRadius= {45*MHAutoSizeScale.AutosizeScale1080x1920/2}
              active={false}
              ref = {switchBtn => this._switchBtn = switchBtn}/>
            </View>
          </View>
          <View key={"sep_"+this.props.key} style={[styles.separator, {backgroundColor: '#f7f7f7'}]}></View>
        </View>
      );
    }

    setSwichByProps(isOn) {
      if (this._switchBtn) {
        if (isOn) {
          this._switchBtn.activate();
        }else {
          this._switchBtn.deactivate();
        }
      }
    }

};

var styles = StyleSheet.create({
  textContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flex: 1,
  },
  rowContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flex: 1,
    height: 180*MHAutoSizeScale.AutosizeScale1080x1920,
  },
  title: {
    fontSize: 42*MHAutoSizeScale.AutosizeScale1080x1920,
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'left',
    color: '#4A4C4E',
    flex: 1,
    marginLeft: 45*MHAutoSizeScale.AutosizeScale1080x1920,
    marginRight: 45*MHAutoSizeScale.AutosizeScale1080x1920,
  },
  switchView: {
    marginRight: 45*MHAutoSizeScale.AutosizeScale1080x1920,
    alignSelf: 'center',
  },
  separator: {
     height: 1,
     alignSelf: 'stretch',
     backgroundColor: '#f7f7f7',
     marginLeft: 45*MHAutoSizeScale.AutosizeScale1080x1920,
     marginRight: 45*MHAutoSizeScale.AutosizeScale1080x1920,
  },
});

module.exports = SingleLineSwitchCell;
