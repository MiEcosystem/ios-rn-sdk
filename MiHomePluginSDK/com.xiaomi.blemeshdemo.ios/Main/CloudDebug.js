'use strict';

var React = require('react-native');
var {
  StyleSheet,
  WebView,
  View,
  StatusBar,
  Platform,
  Navigator,
} = React;

class CloudDebug extends React.Component {
  render() {
    var url = 'http://home.mi.com/demo/cloud.html';
    return (
      <View style={styles.container} >
        <StatusBar barStyle='default' />
        <WebView source={{uri:url}} />
      </View>
    );
  }
}

var styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? 64 : 76,
        flexDirection:'row',
        flex:1,
    },

});

var route = {
  key: 'CloudDebug',
  title: '云端调试',
  component: CloudDebug,
  sceneConig: {
    ...Navigator.SceneConfigs.FloatFromRight,
    gestures: {}, // 禁止左划
  }
};

module.exports = {
  component: CloudDebug,
  route: route,
}
