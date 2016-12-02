/**
  helper
  */
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  View,
  TextInput,
  PixelRatio,
  StatusBar,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
} = React;

var MijiaPluginSDK = require('../CommonModules/MijiaPluginSDK');

// 获取插件包内资源路径
function pathForResource(filename) {
  if (MijiaPluginSDK.DEV == true) {
    let bundle = MijiaPluginSDK.basePath;
    if (Platform.OS == 'android') {
      bundle = window.__fbBatchedBridgeConfig.remoteModuleConfig.RCTSourceCode.constants.scriptURL;
      bundle = bundle.substr(0, bundle.lastIndexOf('/Main'));
      bundle += '/Resources/';
    }
    bundle += filename;
    return bundle;
  } else {
    return MijiaPluginSDK.basePath + filename;
  }
}

// 获取插件包内图片source，<Image>用
function sourceOfImage(filename) {
  return {
    uri: pathForResource(filename),
    scale: PixelRatio.get(),
  }
}

module.exports = {
  pathForResource,
  sourceOfImage,
}
