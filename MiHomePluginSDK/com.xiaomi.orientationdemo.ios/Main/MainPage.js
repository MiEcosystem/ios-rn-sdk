'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  Switch,
  TouchableHighlight,
  Image,
  View,
  Modal,
  TextInput,
  PixelRatio,
  StatusBar,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
} = React;


var MHPluginSDK = require('NativeModules').MHPluginSDK;

var OrientationDemo = require('./OrientationDemo');
import Orientation from 'react-native-orientation';
var Button = require('./Button');

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;



class MainPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      requestStatus: false
    };
  }

  _onPresentSubPage(subPageComponent) {
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

  render() {
    return (
      <View style={styles.containerAll} >
        <StatusBar barStyle='light-content' />
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
           <Button onPress={this._onPresentSubPage(OrientationDemo).bind(this)}>
             Present
           </Button>
        </View>
      </View>
    );
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

// 每个页面export自己的route
var route = {
  key: KEY_OF_MAINPAGE,
  title: MHPluginSDK.deviceName,
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
