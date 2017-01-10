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
var NinebotPage = require('./NinebotPage');

var ImageButton = require('../CommonModules/ImageButton');
var DoubleLineColumnCell = require('./Cells/DoubleLineColumnCell');
var DoubleLineArrowCell = require('./Cells/DoubleLineArrowCell');

var MHBluetoothLE = require('NativeModules').MHBluetoothLE;

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

var discoverPeripherals = {};

const ServiceUUID_NORDIC = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

class NinebotSearchPage extends React.Component {
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
                <DoubleLineArrowCell title={rowData.name+'('+connectState+')'} description={'('+rowData.rssi+')'+rowData.identifier} showLine={true}
                arrowSource={this.props.app.sourceOfImage("sub_arrow.png")} onTouchUpInside={() => {
                    this._connectDeviceAlert(rowData);
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
              var peripheral = devices[key].peripheral;
              this._showDevicelist(peripheral);
            }
          }else {
              this._scanForNewDevice();
          }
        });


      }else {
        MHPluginSDK.showFinishTips('蓝牙不可用');
      }
    });
  };

  _scanForNewDevice() {
    MHBluetoothLE.retrieveConnectedPeripheralsWithServices([ServiceUUID_NORDIC], (result) => {
      for (var key in result) {
        var perpheral = result.key;
        this._showDevicelist(perpheral);
      }

    });

    MHPluginSDK.showLoadingTips('开始扫描附近的NineBot');
    MHBluetoothLE.startScan([ServiceUUID_NORDIC], {}, (error) => {
      MHPluginSDK.dismissTips();
    });

    setTimeout(() => {
      if (this._isEmptyObject(discoverPeripherals)) {
        MHPluginSDK.showFailTips('未发现附近的NineBot设备');
        MHBluetoothLE.stopScan(() => {});
        this.props.navigator.pop();
      }else {
        MHPluginSDK.dismissTips();
      }
    }, 20000);
  }

  _showDevicelist(peripheral) {

    if(peripheral && peripheral.name && peripheral.name.length > 0 && parseInt(peripheral.rssi) > (-100) && parseInt(peripheral.rssi) < 0){
      discoverPeripherals[peripheral.identifier] = peripheral;

      MHPluginSDK.dismissTips();

      this.setState({dataSource: this.state.dataSource.cloneWithRows(
        this._genRows()
      )});
    }
  };

  _genRows() {
    var peripheralList = new Array();

    if(discoverPeripherals){
      for(var index in discoverPeripherals){
        peripheralList.push(discoverPeripherals[index]);
      }
    }
    return peripheralList;
  };

  _connectDeviceAlert(peripheral) {

    if(peripheral.state == 'disconnected' || peripheral.state == 'unknown'){
      Alert.alert(
        '提示',
        '是否连接设备？',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => {
            this._connectDevice(peripheral);
          }},
        ]
      )
    }else if(peripheral.state == 'connected'){
      Alert.alert('提示',
        '设备已经连接',
        [
          {text: 'OK', onPress: () => {
            this._connectSuccess(peripheral);
          }},
        ]);
    }else if(peripheral.state == 'connecting'){
      Alert.alert('提示',
        '设备正在连接',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
    } if(peripheral.state == 'disconnecting'){
      Alert.alert('提示',
        '正在断开连接',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
    }
  }

  _connectDevice(peripheral) {
    MHPluginSDK.showLoadingTips('设备连接中..');
    MHBluetoothLE.connect(peripheral.identifier, {}, (error, result) => {
      MHPluginSDK.dismissTips();
      if (error) {
        MHPluginSDK.showFailTips('设备连接失败');
        return;
      }

      this._connectSuccess(result);
    });
  }

  _connectSuccess(peripheral){
    MHPluginSDK.onFinishing([peripheral.identifier], 'xiaomi.demo.v1', (error, body) => {
      if (!error) {
        MHPluginSDK.openDevice(peripheral.identifier, 'xiaomi.demo.v1', () => {
        });
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

const KEY_OF_Page = 'NinebotSearchPage';

// 打开更多菜单
var openMorePage = function (navigator) {
  navigator.push(MoreMenu.route);
};

// 每个页面export自己的route
var route = {
  key: 'KEY_OF_Page',
  title: '搜索NineBot',
  component: NinebotSearchPage,
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
  component: NinebotSearchPage,
  route: route,
}
