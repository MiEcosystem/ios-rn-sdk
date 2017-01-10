'use strict';

var React = require('react-native');
var {
  StyleSheet,
  WebView,
  View,
  StatusBar,
  Platform,
  Navigator,
  Dimensions,
  ART
} = React;

var {
  width,
  height
} = Dimensions.get('window');

var {
  Surface,
  Shape,
  Path
} = ART;

var Rectangle = require('./Rectangle.art');

class ARTRectDemo extends React.Component {
  render() {
      // 构建矩形路径
      var mutilRect = Path()
        .move(width/2-50,(height - (Platform.OS === 'ios' ? 64 : 76))/4-150)
        .line(100,23)
        .line(45,120)
        .line(-100,89)
        .line(45, -140)
        .close();

    return (
      <View style={styles.container} >
        <StatusBar barStyle='default' />
        <Surface width={width} height={(height - (Platform.OS === 'ios' ? 64 : 76))/2}>
          <Rectangle x={width/2-50} y={20} width={100}
            height={200}
            stroke="red"
            strokeWidth={1}
            fill="#3F4FFF" />
        </Surface>
        <Surface width={width} height={(height - (Platform.OS === 'ios' ? 64 : 76))/2}>
          <Shape d={mutilRect} stroke="#000000" strokeWidth={2} fill="#ff3f4f" />
        </Surface>
      </View>
    );
  }
}

var styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 64 : 76,
        flexDirection:'column',
        flex:1,
    },

});

var route = {
  key: 'ARTRectDemo',
  component: ARTRectDemo,
  title: '矩形：Rect',
  sceneConig: {
    ...Navigator.SceneConfigs.FloatFromRight,
    gestures: {}, // 禁止左划
  }
};

module.exports = {
  route: route,
}
