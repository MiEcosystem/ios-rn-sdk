'use strict';

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

var MHPluginSDK = require('NativeModules').MHPluginSDK;
var MHAirPurifierStarParticle = require('./MHAirPurifierStarParticle');

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class MainPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      requestStatus: false,
    };
  }

  render() {

    return (
      <View style={styles.containerAll} >
        <StatusBar barStyle='light-content' />
        <MHAirPurifierStarParticle> </MHAirPurifierStarParticle>
      </View>
    );
  }

  _onOpenSubPage(subPageComponent) {
    function subPage() {
      this.props.navigator.push({
        ...subPageComponent.route,
        passProps: {
          message: 'amazing!',
        },
      });
    }
    return subPage;
  }

  componentWillMount() {
    this._deviceNameChangedListener = DeviceEventEmitter.addListener(MHPluginSDK.deviceNameChangedEvent, (event) => {
      route.title = event.newName;
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this._deviceNameChangedListener.remove();
  }
}

var styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#838383',
    marginTop: 0,
  }
});

const KEY_OF_MAINPAGE = 'MainPage';

// 打开更多菜单
var openMorePage = function (navigator) {
  navigator.push(MoreMenu.route);
};

// 每个页面export自己的route
var route = {
  key: KEY_OF_MAINPAGE,
  title: '空气净化器粒子效果',
  component: MainPage,
  navLeftButtonStyle: {
    tintColor:'#ffffff',
  },
  navTitleStyle: {
    color:'#ffffff',
  },
  navBarStyle: {
    backgroundColor:'transparent',
  },
  isNavigationBarHidden: false,
}

module.exports = {
  component: MainPage,
  route: route,
}
