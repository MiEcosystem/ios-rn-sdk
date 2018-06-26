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
  StatusBar,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
} = React;

const MHPluginSDK = require('NativeModules').MHPluginSDK;
const MHBluetooth = require('NativeModules').MHBluetooth;
const Setting = require('./MHSetting');
const ControlDemo = require('./ControlDemo');
const ImageButton = require('../CommonModules/ImageButton');

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class MainPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      requestStatus: false,
    };
  }

  render() {
    let rowControlDemo = this._createMenuRow("控制示例");
    let rowDFUDemo = this._createMenuRow("固件升级");

    return (
      <View style={styles.containerAll} >
        <StatusBar barStyle='light-content' />
        <View style={styles.containerIconDemo}>
          <Image style={styles.iconDemo} source={this.props.app.sourceOfImage("control_home.png")} />
          <Text style={styles.iconText}>欢迎使用小米开发板</Text>
        </View>
        <View style={styles.containerMenu}>
          {rowControlDemo}
          {rowDFUDemo}
        </View>
      </View>
    );
  }

  _createMenuRow(title) {
    return [
      (<TouchableHighlight key={"touch_"+title} style={styles.rowContainer} underlayColor='#838383' onPress={()=>this._onOpenSubPage(title)}>
        <View style={styles.rowContainer}>
          <Text style={styles.title}>{title}</Text>
          <Image style={styles.subArrow} source={this.props.app.sourceOfImage("sub_arrow.png")} />
        </View>
      </TouchableHighlight>),
      (<View key={"sep_"+title} style={styles.separator} />)
    ];
  }

  _onOpenSubPage(title) {
    if (title === "控制示例") {
        this.props.navigator.push({
          ...ControlDemo.route,
        });
    }
    else if (title  === "固件升级") {
        MHBluetooth.openMeshDFU();
    }
  }

  componentDidMount() {
    this._deviceNameChangedListener = DeviceEventEmitter.addListener(MHPluginSDK.deviceNameChangedEvent, (event) => {
      route.title = event.newName;
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this._deviceNameChangedListener.remove();
  }
}

const styles = StyleSheet.create({
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
  rowContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flex: 1,
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
     width: 9,
     height: 17,
     marginRight: 15,
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

// 打开更多菜单
const openMorePage = function (navigator) {
  navigator.push(Setting.route);
};

// 每个页面export自己的route
const route = {
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
  renderNavRightComponent: function(route, navigator, index, navState) {
    if (MHPluginSDK.userId == MHPluginSDK.ownerId) // 非分享设备
    {
      return (
        <View style={{left:0, width:29+15*2, height:APPBAR_HEIGHT, justifyContent:'center', alignItems:'center'}}>
          <ImageButton
            source={{uri:MHPluginSDK.uriNaviMoreButtonImage, scale:PixelRatio.get()}}
            onPress={() => {
              openMorePage(navigator);
            }}
            style={[{width:29, height:29, tintColor: '#ffffff'}]}
          />
        </View>
      );
    }
    else {
      return null;
    }
  },
}

module.exports = {
  component: MainPage,
  route: route,
}
