/**
 * 通用的Button控件
 *
 * 引用：var Button = require('../CommonModules/Button');
 *
 * 使用演示示例：
 * <Button onPress={this._handlePress} title="测试"
 *   imageNormal="RemoteControlInfo/remote_home_normal.png" imageHighlight="RemoteControlInfo/remote_home_pressed.png"
 *   imagePropTypes={64} imageHeight={64} titleSize={14}/>
 *
 * 参数说明：
 * title：按钮显示名称，可以省略
 * imageNormal：按钮显示图片，可以省略
 * imageHighlight：按钮显示高亮图片，可以省略
 * imagePropTypes：按钮显示图片宽度，可以省略，默认54
 * imageHeight：按钮显示图片高度，可以省略，默认54
 * titleSize：按钮显示名称文字大小，可以省略，默认14
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
  Image,
} = React;

var MHAutoSizeScale = require('../Tools/MHAutoSizeScale');

class DoubleLineButtonCell extends Component {
    constructor(props) {
        super(props);

        this.state = {
          ...TouchableHighlight.propTypes,
          disabled: this.props.disabled,
          title: this.props.title,
          description: this.props.description,
          buttonTitle: this.props.buttonTitle,
        };
    }

    _viewOnTouched() {
      if (this.props.onTouchUpInside) {
        this.props.onTouchUpInside();
      }
    }

    render() {
      return (
        <View style={this.props.style}>
          <View style={styles.rowContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{this.props.title}</Text>
              <Text style={styles.description}>{this.props.description}</Text>
            </View>
            <TouchableHighlight disabled={this.state.disabled} key={"touch_"+this.props.key} style={styles.button} underlayColor='#838383'
            onPress={() => this._viewOnTouched()}>
              <Text style={styles.updateTitle}>{this.state.buttonTitle}</Text>
            </TouchableHighlight>
          </View>
          <View key={"sep_"+this.props.key} style={styles.separator} />
        </View>
      );
    }

};

var styles = StyleSheet.create({
  allContainer: {
    alignSelf: 'stretch',
    flex: 1,
  },
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
    alignItems: 'stretch',
    alignSelf: 'stretch',
    textAlign: 'left',
    color: '#4A4C4E',
    height: 42*MHAutoSizeScale.AutosizeScale1080x1920,
    marginLeft: 45*MHAutoSizeScale.AutosizeScale1080x1920,
    marginTop: (180-42)/2*MHAutoSizeScale.AutosizeScale1080x1920,
    marginRight: 45*MHAutoSizeScale.AutosizeScale1080x1920,
    marginBottom: 6*MHAutoSizeScale.AutosizeScale1080x1920,
  },
  description: {
    fontSize: 36*MHAutoSizeScale.AutosizeScale1080x1920,
    alignItems: 'stretch',
    alignSelf: 'stretch',
    textAlign: 'left',
    color: '#A4AAAE',
    height: 36*MHAutoSizeScale.AutosizeScale1080x1920,
    marginLeft: 8*MHAutoSizeScale.AutosizeScale1080x1920,
    marginTop: (180-36)/2 *MHAutoSizeScale.AutosizeScale1080x1920,
  },
  button: {
     width: 120*MHAutoSizeScale.AutosizeScale1080x1920,
     height: 64*MHAutoSizeScale.AutosizeScale1080x1920,
     borderRadius: 32*MHAutoSizeScale.AutosizeScale1080x1920,
     borderWidth: 1,
     borderColor: '#A4AAAE',
     flexDirection: 'row',
     marginRight: 45*MHAutoSizeScale.AutosizeScale1080x1920,
     alignSelf: 'center',
     alignItems: 'center',
  },
  updateTitle: {
    flex: 1,
    fontSize: 36*MHAutoSizeScale.AutosizeScale1080x1920,
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    color: '#A4AAAE',
  },
  separator: {
     height: 1,
     alignSelf: 'stretch',
     backgroundColor: '#f7f7f7',
     marginLeft: 45*MHAutoSizeScale.AutosizeScale1080x1920,
     marginRight: 45*MHAutoSizeScale.AutosizeScale1080x1920,
  },
});

module.exports = DoubleLineButtonCell;
