/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  Platform,
  PixelRatio,
} = React;

var MHPluginSDK = require('NativeModules').MHPluginSDK;
var MHBluetooth = require('NativeModules').MHBluetooth;
var ImageButton = require('../CommonModules/ImageButton');

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

var MoreMenu = require('./MoreMenu');

var MainPage = React.createClass({
  getInitialState: function() {
    // MHPluginSDK提供了设备和插件系统相关的各种常量，详见MHReactNativeBridgeModule文档，其中basePath为本插件资源目录的路径，可以用来取得图片等资源；devMode属性表示当前状态是开发调试还是正式线上；由于线上和调试环境取得图片的方式是不一样的，这两个属性需要配合使用，详见CommonModules/HelloDeveloper.js中Image控件的使用
    return {
      did: MHPluginSDK.deviceId,
      model: MHPluginSDK.deviceModel,
      apiLevel: MHPluginSDK.apiLevel,
      basePath: MHPluginSDK.basePath,
      devMode: MHPluginSDK.devMode,
    };
  },

  componentDidMount: function() {
    // 监听设备改名通知
    this._deviceNameChangedListener = DeviceEventEmitter.addListener(MHPluginSDK.deviceNameChangedEvent, (event) => {
      route.title = event.newName;
      this.forceUpdate();
    });
    // 可以在这里注册监听设备状态6s轮询的通知，监听前需要用registerDeviceStatusProps方法来指定轮询哪些设备属性，将会调用RPC的getProps方法与设备通信获取相应属性值
    this._s1 = DeviceEventEmitter.addListener(
      MHBluetooth.centralManager_didDisconnectPeripheral_error,
      (notification) => {
        console.log("Device disconnected!");
      }
    );
    this._s2 = DeviceEventEmitter.addListener(
      MHBluetooth.peripheral_didDiscoverServices,
      (notification) => {
        console.log("discoverServices");
        MHBluetooth.serviceUUIDsWithCallback((uuids) => {
            console.log("service uuids : " + uuids);
            MHBluetooth.discoverCharacteristicsOfServiceUUID("fe95");
        });
     }
    );

    this._s3 = DeviceEventEmitter.addListener(
      MHBluetooth.peripheral_didDiscoverCharacteristicsForService_error,
      (notification) => {
        console.log("discoverCharacteristics");
        MHBluetooth.characteristicUUIDsOfServiceUUIDWithCallback("fe95", (uuids) => {
          console.log("characteristics uuids: " + uuids);
        });
        MHBluetooth.setNotifyWithCallback(true, '0001', 'fe95', (res) => {

        });
      });

    this._s4 = DeviceEventEmitter.addListener(
      MHBluetooth.peripheral_didUpdateNotificationStateForCharacteristic_error, (notification) => {
        alert(JSON.stringify(notification));
    });


    // MHBluetooth.scanAndConnectForSeconds(10,(nothing) => {
    //   // MHBluetooth.discoverServices();
    // },(error) => {
    //   // alert(error);
    // },(nothing) => {
    //   alert("timeout");
    // });
    MHBluetooth.scanAndConnectForSeconds(10, (error)=>{
      if (error.code == 200) {
        alert("连接成功");
      }else if (error.code == 404) {
        alert("超时");
      }else if (error.code == 3) {
        alert("需要去register");
      }
    });//, function() {}, function() {}, function() {});
  },

  componentWillUnmount: function() {
    console.log("unmount");
    this._s1.remove();
    this._s2.remove();
    this._s3.remove();
    this._s4.remove();
    this._deviceNameChangedListener.remove();
  },

  render: function() {
    return (<View style={styles.container}><Text style={styles.text}>Device {this.state.did}</Text></View>);
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999999',
    marginBottom: 0,
    marginTop: 0,
  },
  text: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
    alignSelf: 'stretch',
    marginTop: 300,
  },
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
