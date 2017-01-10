'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  View,
  StatusBar,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
  ListView,
  Dimensions
} = React;

var MHPluginSDK = require('NativeModules').MHPluginSDK;
var {height:screenHeight, width:screenWidth} = Dimensions.get('window');

var ARTPage = require('./ARTPage.js');
var AnimationPage = require('./AnimationPage');

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class MainPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.containerAll} >
        <StatusBar barStyle='light-content' />
        <View style={styles.mainContainer}>
          <TouchableHighlight style={[styles.viewContainer, {backgroundColor: 'antiquewhite'}]} onPress={this._onOpenSubPage(ARTPage).bind(this)}>
            <Text style={styles.text}>{ARTPage.route.title}</Text>
          </TouchableHighlight>
          <TouchableHighlight style={[styles.viewContainer, {backgroundColor: 'lavenderblush'}]} onPress={this._onOpenSubPage(AnimationPage).bind(this)}>
            <Text style={styles.text}>{AnimationPage.route.title}</Text>
          </TouchableHighlight>
        </View>
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
  },
  mainContainer: {
    marginTop: 64,
    height: screenHeight-64,
  },
  viewContainer:{
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: 'white',
    padding: 12.5
  },
  text: {
    flex: 1,
    color: '#1e1e2e',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
  },
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
