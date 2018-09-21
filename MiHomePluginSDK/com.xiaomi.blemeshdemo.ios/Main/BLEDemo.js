'use strict';

const React = require('react-native');
const {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  View,
  TextInput,
  PixelRatio,
  DeviceEventEmitter,
  StatusBar,
  TouchableOpacity,
} = React;

const MHPluginSDK = require('NativeModules').MHPluginSDK;
const MHBluetooth = require('NativeModules').MHBluetooth;

class BLEDemo extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {

    };
  }

  componentDidMount() {
    MHBluetooth.scanAndConnectForSeconds(10, (isSucess, error) => {

    });
  }

  componentWillMount() {

  }

  componentWillUnmount() {
    MHBluetooth.disconnectDevice();
  }

  render() {
    return (
      <View style={styles.containerAll}>
        <StatusBar barStyle='default' />

      </View >
    );
  }
}

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#838383',
    marginTop: 66,
  },

});

const route = {
  key: 'BLEDemo',
  title: '蓝牙直连(登录)',
  component: BLEDemo,
};

module.exports = {
  component: BLEDemo,
  route: route,
}
