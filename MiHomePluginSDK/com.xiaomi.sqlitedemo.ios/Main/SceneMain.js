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

var MijiaPluginSDK = require('../CommonModules/MijiaPluginSDK');
var MijiaPluginHelper = require('../CommonModules/MijiaPluginHelper');
var ImageButton = require('../CommonModules/ImageButton');

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class SceneMain extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      requestStatus: false,
    };
  }

  componentDidMount() {
    alert('Trigger: '+JSON.stringify(MijiaPluginSDK.sceneInfo.trigger));
    alert('Action: '+JSON.stringify(MijiaPluginSDK.sceneInfo.action));
    alert('Payload: '+JSON.stringify(MijiaPluginSDK.sceneInfo.payload));
  }

  render() {
    return (
      <View style={styles.containerAll} >
        <StatusBar barStyle='light-content' />
        <View style={styles.containerIconDemo}>
          <Image style={styles.iconDemo} source={MijiaPluginHelper.sourceOfImage("control_home.png")} />
          <Text style={styles.iconText}>开发自定义智能场景</Text>
        </View>
        <View style={styles.containerMenu}>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#838383',
    marginTop: 0,
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
});

const KEY_OF_SCENEMAIN = 'SceneMain';

// 每个页面export自己的route
function route() {
  return {
    key: KEY_OF_SCENEMAIN,
    title: '自定义场景',
    component: SceneMain,
    navLeftButtonStyle: {
      tintColor:'#ffffff',
    },
    navTitleStyle: {
      color:'#ffffff',
    },
    navBarStyle: {
      backgroundColor:'transparent',
    },
    renderNavLeftComponent(route, navigator, index, navState) {
      return (<View style={{left:0, width:29+15*2, height:APPBAR_HEIGHT, justifyContent:'center', alignItems:'center'}}>
        <ImageButton
          source={{uri:"", scale:PixelRatio.get()}}
          onPress={() => {
            if (index === 0) {
              MijiaPluginSDK.finishCustomSceneSetup(MijiaPluginSDK.extraInfo.payload);
              MijiaPluginSDK.exitPlugin();
            } else {
              navigator.pop();
            }
          }}
          style={[{width:29, height:29, tintColor: '#000000'}, route.navLeftButtonStyle]}
        />
      </View>);
    },
    isNavigationBarHidden: false,
  }
}

module.exports = {
  component: SceneMain,
  route: route,
}
