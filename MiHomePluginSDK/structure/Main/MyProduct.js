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

var MyProduct = React.createClass({
  render: function() {
    return (
      <View style={styles.container} >
        <StatusBar barStyle='default' />
        <WebView style={styles.container} source={{url:'http://home.mi.com/demo/product.html'}}/>
      </View>
    );
  },

});

var styles = StyleSheet.create({
    container: {
      marginTop: Platform.OS === 'ios' ? 64 : 76,
    },
});

var route = {
  key: 'MyProduct',
  title: '创建自己的产品',
  component: MyProduct,
  sceneConig: {
    ...Navigator.SceneConfigs.FloatFromRight,
    gestures: {}, // 禁止左划
  }
};

module.exports = {
  component: MyProduct,
  route: route,
};
