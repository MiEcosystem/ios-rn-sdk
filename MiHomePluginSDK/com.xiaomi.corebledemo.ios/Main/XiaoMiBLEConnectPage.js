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
var MHXiaomiBLE = require('NativeModules').MHXiaomiBLE;

var MoreMenu = require('./MoreMenu');
var NinebotPage = require('./NinebotPage');

var ImageButton = require('../CommonModules/ImageButton');
var DoubleLineColumnCell = require('./Cells/DoubleLineColumnCell');
var DoubleLineArrowCell = require('./Cells/DoubleLineArrowCell');

var MHBluetoothLE = require('NativeModules').MHBluetoothLE;

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

var discoverPeripherals = {};


const ServiceUUID = "FFEF";

class XiaoMiBLEConnectPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      devices: {},
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
              var connectState = '未知';
              if(rowData.state === 'connected'){
                connectState = '已连接';
              }else if(rowData.state === 'disconnected'){
                connectState = '未连接';
              }else if(rowData.state === 'connecting'){
                connectState = '正在连接';
              } if(rowData.state === 'disconnecting'){
                connectState = '正在断开连接';
              }

              return(
                <DoubleLineArrowCell title={rowData.peripheral.name+'('+connectState+')'} description={'('+rowData.peripheral.rssi+')'+rowData.peripheral.identifier} showLine={true}
                arrowSource={this.props.app.sourceOfImage("sub_arrow.png")} onTouchUpInside={() => {
                  var device = rowData;
                  this._registerDevice(device);
                  }
                } />
              );
            }
          }
        />
      </View>
    )
  }

  _isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
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
  };

  componentWillMount() {
    this._deviceNameChangedListener = DeviceEventEmitter.addListener(MHPluginSDK.deviceNameChangedEvent, (event) => {
      route.title = event.newName;
      this.forceUpdate();
    });

    this._didDiscoverPeripheralListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.centralManager_didDiscoverPeripheral_advertisementData_RSSI, (perpheral) => this._showDevicelist(perpheral));

    MHBluetoothLE.isEnabled((enable) => {
      if(enable){
        //已经有了扫描结果
        MHBluetoothLE.getDeviceList((error, devices) => {
          if (!error && devices.length && devices.length >= 1) {
            this.state.devices = devices;
            for (var key in devices) {
              var device = devices[key];
              this._showDevicelist(device);
            }
          }
        });
      }else {
        MHPluginSDK.showFinishTips('蓝牙不可用');
      }
    });
  };


  _showDevicelist(device) {
    var peripheral = device.peripheral;
    if(peripheral && parseInt(peripheral.rssi) > (-100) && parseInt(peripheral.rssi) < 0){
      MHPluginSDK.dismissTips();

      this.setState({dataSource: this.state.dataSource.cloneWithRows(
        this._genRows()
      )});
    }
  };

  _genRows() {
    var peripheralList = new Array();

    if(this.state.devices){
      for(var index in this.state.devices){
        peripheralList.push(this.state.devices[index]);
      }
    }
    return peripheralList;
  };



  _registerDevice(device){
    MHPluginSDK.showLoadingTips('注册设备中.');
    MHXiaomiBLE.registerXiaoMiBLE(device.did, device.mac, 8, (error, info) =>{
      MHPluginSDK.dismissTips();
      if (!error) {
        var device = info.device;
        MHPluginSDK.onFinishing([device.did], 'xiaomi.bledemo.v1', (error, body) => {
          console.warn(JSON.stringify(error));
          console.warn(JSON.stringify(body));
          if (!error && body.model === 'xiaomi.bledemo.v1') {
            MHPluginSDK.openDevice(device.did, 'xiaomi.bledemo.v1', () => {
            });
          }else {
            MHPluginSDK.showFailTips('添加到设备列表失败');
          }
        });
      }else {
        //alert(error.message);
        MHPluginSDK.showFailTips(error.message);
      }
    });
  }
  componentWillUnmount() {
    this._deviceNameChangedListener.remove();
    this._didDiscoverPeripheralListener.remove();
    MHBluetoothLE.stopScan(() => {});
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

const KEY_OF_Page = 'XiaoMiBLEConnectPage';

// 打开更多菜单
var openMorePage = function (navigator) {
  navigator.push(MoreMenu.route);
};

// 每个页面export自己的route
var route = {
  key: 'KEY_OF_Page',
  title: '连接小米蓝牙开发板',
  component: XiaoMiBLEConnectPage,
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
  component: XiaoMiBLEConnectPage,
  route: route,
}
