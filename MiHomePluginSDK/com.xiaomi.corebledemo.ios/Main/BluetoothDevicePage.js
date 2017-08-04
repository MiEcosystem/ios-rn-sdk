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
var PeripheralPage = require('./PeripheralPage');

var ImageButton = require('../CommonModules/ImageButton');
var DoubleLineColumnCell = require('./Cells/DoubleLineColumnCell');
var DoubleLineArrowCell = require('./Cells/DoubleLineArrowCell');

var MHBluetoothLE = require('NativeModules').MHBluetoothLE;

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

var discoverPeripherals = {};

class BluetoothDevicePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
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

  componentDidMount() {
    this._deviceNameChangedListener = DeviceEventEmitter.addListener(MHPluginSDK.deviceNameChangedEvent, (event) => {
      route.title = event.newName;
      this.forceUpdate();
    });

    this._didDiscoverPeripheralListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.centralManager_didDiscoverPeripheral_advertisementData_RSSI, (perpheral) => this._showDevicelist(perpheral));

    MHBluetoothLE.isEnabled((enable) => {
      if(enable){
        MHPluginSDK.showFinishTips('开始扫描蓝牙设备');
        MHBluetoothLE.startScan([], {}, (error) => {
          alert(JSON.stringify(error));
        });
      }else {
        MHPluginSDK.showFinishTips('蓝牙不可用');
      }
    });
  };

  _showDevicelist(peripheral) {
    if(peripheral && peripheral.name && peripheral.name.length > 0 && parseInt(peripheral.rssi) > (-100) && parseInt(peripheral.rssi) < 0){
      discoverPeripherals[peripheral.identifier] = peripheral;

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
          {text: 'OK', onPress: () => console.log('OK Pressed')},
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
      if (error) {
        MHPluginSDK.showFailTips('设备连接失败');
        return;
      }
      this._connectSuccess(result);
    });
  }

  _connectSuccess(peripheral){
    MHPluginSDK.showFinishTips('设备连接成功');
    this.props.navigator.push({
        ...PeripheralPage.route,
        passProps: {
          peripheral: peripheral,
          message: 'amazing!',
        },
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

const KEY_OF_BluetoothDevicePage = 'BluetoothDevicePage';

// 打开更多菜单
var openMorePage = function (navigator) {
  navigator.push(MoreMenu.route);
};

// 每个页面export自己的route
var route = {
  key: KEY_OF_BluetoothDevicePage,
  title: MHPluginSDK.deviceName,
  component: BluetoothDevicePage,
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
  ç: BluetoothDevicePage,
  route: route,
}
