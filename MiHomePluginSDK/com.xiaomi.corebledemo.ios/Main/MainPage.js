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
  ListView,
  Alert,
} = React;

var MHPluginSDK = require('NativeModules').MHPluginSDK;

var MoreMenu = require('./MoreMenu');

//平衡车快联页和控制页
var NinebotSearchPage = require('./NinebotSearchPage');
var NinebotPage = require('./NinebotPage');

//指定蓝牙快联页和控制页
var XiaoMiBLEMainPage = require('./XiaoMiBLEMainPage');
var XiaoMiBLEConnectPage = require('./XiaoMiBLEConnectPage');

//附近蓝牙页面
var BluetoothDevicePage = require('./BluetoothDevicePage');

var ImageButton = require('../CommonModules/ImageButton');
var DoubleLineColumnCell = require('./Cells/DoubleLineColumnCell');
var DoubleLineArrowCell = require('./Cells/DoubleLineArrowCell');

var MHBluetoothLE = require('NativeModules').MHBluetoothLE;

var SecureKey = require('./SecureKey');

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

var discoverPeripherals = {};

class MainPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        {name: '小米蓝牙开发板', page: {}, key: 'XiaoMiBLE'},
        {name: '周围蓝牙设备列表', page: BluetoothDevicePage, key: 'BluetoothDevicePage'},
        {name: '电子钥匙', page: SecureKey, key: 'SecureKey'},
      ]),
    };
  }
  render() {
    return (
      <View style={styles.containerAll} >
        <StatusBar barStyle='light-content' />
        <View style={styles.listHeader} >
          <Text></Text>
        </View>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
              return(
                <DoubleLineArrowCell title={rowData.name} description='' showLine={true}
                arrowSource={this.props.app.sourceOfImage("sub_arrow.png")}
                key={rowData.key}
                onTouchUpInside={this._onOpenSubPage(rowData).bind(this)} />
              );
            }
          }
        />
      </View>
    )
  }

  _onOpenSubPage(subPageComponent) {
    if (subPageComponent.key === 'XiaoMiBLE') {
      if(MHPluginSDK.pageName === 'connect'){
        subPageComponent = XiaoMiBLEConnectPage;
      }else {
        subPageComponent = XiaoMiBLEMainPage;
      };
    }else if (subPageComponent.key === 'SecureKey') {
      subPageComponent = SecureKey;
    }
    else {
      subPageComponent = BluetoothDevicePage;
    }
    function subPage() {
      this.props.navigator.push({
        ...subPageComponent.route,
        passProps: {
          message: 'amazing!',
        },
      });
    }
    return subPage;
  };

  componentWillMount() {
    this._deviceNameChangedListener = DeviceEventEmitter.addListener(MHPluginSDK.deviceNameChangedEvent, (event) => {
      route.title = event.newName;
      this.forceUpdate();
    });

  };


  componentWillUnmount() {
    this._deviceNameChangedListener.remove();

  }
}





var styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    marginTop: 0,
  },
  listHeader: {
    height: 64,
    backgroundColor: '#0f4287',
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
  title: MHPluginSDK.deviceName,
  component: MainPage,
  navLeftButtonStyle: {
    tintColor:'#ffffff',
  },
  navTitleStyle: {
    color:'#ffffff',
  },
  navBarStyle: {
    backgroundColor:'#0f4287',
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
