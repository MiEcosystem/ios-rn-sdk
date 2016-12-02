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
  Dimensions,
} = React;

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56+MijiaPluginSDK.StatusBarHeight;
var window = Dimensions.get('window');

var ImageButton = require('../CommonModules/ImageButton');
var MijiaPluginHelper = require('../CommonModules/MijiaPluginHelper');
var MijiaPluginSDK = require('../CommonModules/MijiaPluginSDK');

var SQLiteDemoPromiseForIOS = require('./sqlitedemo.promise.ios');
var SQLiteDemoCallbackForIOS = require('./sqlitedemo.callback.ios');

var SQLite = require('react-native-sqlite-storage');
SQLite.DEBUG(true);
alert('Promise和Callback两种模式只能运行其一，修改sqliteEnablePromise的值进行切换')
var sqliteEnablePromise = false;
SQLite.enablePromise(sqliteEnablePromise);

class MainPage extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {

    var sqliteDemoPromiseForIOS = this._createMenuRow(SQLiteDemoPromiseForIOS);
    var sqliteDemoCallbackForIOS = this._createMenuRow(SQLiteDemoCallbackForIOS);



    return (
      <View style={styles.containerAll} >
        <StatusBar barStyle='light-content' />
        <View style={styles.containerMenu}>
          {sqliteDemoPromiseForIOS}
          {sqliteDemoCallbackForIOS}
        </View>
      </View>
    );
  }

  _createMenuRow(component) {
    let route = component.route();
    return [
      (<TouchableHighlight key={"touch_"+route.title} style={styles.rowContainer} underlayColor='#838383' onPress={this._onOpenSubPage(component).bind(this)}>
        <View style={styles.rowContainer}>
          <Text style={styles.title}>{route.title}</Text>
          <Image style={styles.subArrow} source={MijiaPluginHelper.sourceOfImage("sub_arrow.png")} />
        </View>
      </TouchableHighlight>),
      (<View key={"sep_"+route.title} style={styles.separator} />)
    ];
  }

  _onOpenSubPage(subPageComponent) {
    function subPage() {
      this.props.navigator.push({
        ...subPageComponent.route(),
        passProps: {
          message: 'amazing!',
        },
      });
    }
    return subPage;
  }

}

var styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
    marginTop: 64,
  },
  containerIconDemo: {
    flex: 1.7,
    flexDirection: 'column',
    backgroundColor: '#191919',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  containerMenu: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
  },
  iconDemo: {
    width: 270,
    height: 181,
    alignSelf: 'center',
  },
  iconText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: 20,
    alignSelf: 'center'
  },
  rowContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 80,
  },
  title: {
    fontSize: 17,
    alignItems: 'center',
    alignSelf: 'center',
    color: '#000000',
    flex: 1,
    marginLeft:15
  },
  subArrow: {
    // position: 'absolute',
    width: 9,
    height: 17,
    marginLeft: window.width - 275,
    alignSelf: 'center',
  },
  separator: {
     height: 0.5,
     alignSelf: 'stretch',
     backgroundColor: '#dddddd',
     marginLeft:15,
     marginRight: 15,
  },
});

const KEY_OF_MAINPAGE = 'MainPage';

var device = {};

async function fetchDevice() {
  var x = await MijiaPluginSDK.deviceSnapshotFromMem([]);
  return x;
}
fetchDevice().then(result => {
  device = result;
})

// 每个页面export自己的route
function route() {
  return {
    key: KEY_OF_MAINPAGE,
    title: device.name || "",
    component: MainPage,
    navLeftButtonStyle: {
      tintColor:'#ffffff',
    },
    navTitleStyle: {
      color:'#ffffff',
    },
    navBarStyle: {
      backgroundColor:'#a3a3a3',
    },
    isNavigationBarHidden: false,
    renderNavRightComponent: function(route, navigator, index, navState) {
      return null;
    },
  }
}

module.exports = {
  component: MainPage,
  route: route,
}
