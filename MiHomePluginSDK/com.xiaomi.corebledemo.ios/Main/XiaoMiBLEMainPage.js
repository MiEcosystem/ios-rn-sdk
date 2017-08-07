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
  DeviceEventEmitter,
  StatusBar,
  TouchableOpacity,
} = React;

var MHPluginSDK = require('NativeModules').MHPluginSDK;
var MHBluetoothLE = require('NativeModules').MHBluetoothLE;
var MHXiaomiBLE = require('NativeModules').MHXiaomiBLE;

const UUID_SERVICE = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
const UUID_LED_READ_WRITE = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
const UUID_BUTTON_READ_WRITE_NOTIFY = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

var SingleLineSwitchCell = require('./Cells/SingleLineSwitchCell');
var DoubleLineRowCell = require('./Cells/DoubleLineRowCell');

class XiaoMiBLEMainPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.basePath = MHPluginSDK.basePath;
    this.state = {
      bledColor: '#330000',
      device: false,
      bledCharacteristic: false,
      fledCharacteristic: false,
      fledColor: '#330000',
      rssi: -100,
      isNotifying: false,
      isGlitter: false,
    };
  }

  componentDidMount() {
    //获取当前的设备信息
    MHXiaomiBLE.getDefaultDevice((error, device) => {
      if (!error) {
        MHPluginSDK.showLoadingTips('连接设备中');
        MHXiaomiBLE.loginXiaoMiBLE(device.did, device.mac, 4, (error, result) => {
          MHPluginSDK.dismissTips();
          if (!error) {
            this.state.device = result.device;
            this._initDevice();
          }
          else {
            MHPluginSDK.showFailTips("连接设备失败，XiaomiBLE无法登录");
            this.props.navigator.pop();
          }
        });
      }
      else {
        MHPluginSDK.showFailTips("连接设备失败，XiaomiBLE无法获取设备");
        this.props.navigator.pop();
      }
    });

    //监听蓝牙连接状态信息
    this._didDisconnectPeripheralListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.centralManager_didDisconnectPeripheral_error, (error, peripheral) => {

      MHPluginSDK.showFailTips('连蓝牙设备已断开连接');

      //this.props.navigator.pop();

      if (error) {
        return;
      }
      //显示重连按钮

    });

    //监听数据
    this._didUpdateValueForCharacteristicListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.peripheral_didUpdateValueForCharacteristic_error, (body) => {
      var error = body[0];
      var characteristic = body[1];
      var msgData = body[2];

      this._handleMsg(error, characteristic, msgData);
    });

    //读取信号强度改变
    this._getRSSITimer = setInterval(() => {
      if (this.state.device) {
        MHBluetoothLE.readRSSI(this.state.device.peripheral.identifier, (error, peripheral, rssi) => {
          if (!error) {
            this.setState({
              rssi: rssi,
            });
          }
        });
      }
    }, 1000);


  }

  _initDevice() {
    //读取设备的服务特征
    if (this.state.device) {
      if (!this.state.device.peripheral.services[UUID_SERVICE]) {
        console.log("搜索设备的服务");
        //搜索设备的服务
        MHBluetoothLE.discoverServices(this.state.device.peripheral.identifier, [UUID_SERVICE], (error, peripheral, services) => {
          if (!error && services[UUID_SERVICE]) {
            this._initCharacteristicStatus(services[UUID_SERVICE]);
          }else {
            MHPluginSDK.showFailTips('未能找到匹配的操作:'+error.message);
          }
        });
      }
      else {
        this._initCharacteristicStatus(this.state.device.peripheral.services[UUID_SERVICE]);
      }
    }else {
      MHPluginSDK.showFailTips('设备初始化失败');
    }
  }

  _initCharacteristicStatus(service) {
    console.log("搜索设备的特征");
    if (!service) {
      return;
    }
    this._discoverCharacteristis(UUID_SERVICE, [UUID_LED_READ_WRITE,UUID_BUTTON_READ_WRITE_NOTIFY]);
  }

  _discoverCharacteristis(serivceUUID, characteristicUUIDs) {
    MHBluetoothLE.discoverCharacteristics(this.state.device.peripheral.identifier, serivceUUID, characteristicUUIDs, (error, serivce, characteristics) => {
      if (!error) 
{        //通知是否被打开
        if(characteristics[UUID_BUTTON_READ_WRITE_NOTIFY]){
          this.setState({
            isNotifying: characteristics[UUID_BUTTON_READ_WRITE_NOTIFY].isNotifying,
            bledCharacteristic: characteristics[UUID_BUTTON_READ_WRITE_NOTIFY],
          });
          this._notifySwitch.setSwichByProps(this.state.isNotifying);
        }

        if(characteristics[UUID_LED_READ_WRITE]){
          this.setState({
            fledCharacteristic: characteristics[UUID_LED_READ_WRITE],
          });
        }
      }
    });
  }

  componentWillUnmount() {
     this._didDisconnectPeripheralListener.remove();
     this._didUpdateValueForCharacteristicListener.remove();
     if (this.state.device) {
       MHBluetoothLE.disconnect(this.state.device.peripheral.identifier, (error) => {

       });
     }
     clearInterval(this._getRSSITimer);
  }
  
  render() {
    return (
      <View style={styles.containerAll}>
        <View style={styles.containerIconDemo}>
          <View style={[styles.RGBResultViewButton, {backgroundColor: this.state.bledColor}]}></View>
          <Image style={styles.iconDemo} source={{uri:this.basePath + "control_home.png"}} >
            <View style={[styles.RGBResultViewFlash, {backgroundColor: this.state.fledColor}]}></View>
          </Image>
          <Text style={styles.iconText}>欢迎使用小米蓝牙开发板 {this.props.message}</Text>
        </View>
        <View style={styles.containerControll}>
          <DoubleLineRowCell title='信号强度：' description={this.state.rssi} showLine={true} key='rssi'/>
          <SingleLineSwitchCell title='接收灯信号' description='' showLine={true} isOn={this.state.isNotifying} key='notify'
            ref={(notifySwitch) => {
              this._notifySwitch = notifySwitch;
            }}
            onSwitchChange={(isOn) => {
              if (this.state.bledCharacteristic) {
                this._changeNotifyState(this.state.bledCharacteristic, isOn);
              }
            }}/>
          <SingleLineSwitchCell title='开关闪灯' description='' showLine={true} isOn={this.state.isGlitter} key='light'
            ref={(lightSwitch) => {
              this._lightSwitch = lightSwitch;
            }}
            onSwitchChange={(isOn) => {
              if (this.state.fledCharacteristic) {
                this._changeLightState(this.state.fledCharacteristic, isOn);
              }
            }}/>
        </View>
      </View>
    );
  }

  _handleMsg(error, characteristic, msgData) {
    if (error) {
      MHPluginSDK.showFailTips('获取数据失败:'+JSON.stringify(error));
      return;
    }
    if (characteristic) {
      if (characteristic.uuid === UUID_LED_READ_WRITE) {
        console.log("收到消息: " + JSON.stringify(msgData));
      }
      else if (characteristic.uuid === UUID_BUTTON_READ_WRITE_NOTIFY) {
        //button 按钮消息响应
        console.log("收到消息内容为 " + JSON.stringify(msgData));

        //假如发送给设备的消息经过加密
        MHXiaomiBLE.decryptMessageXiaoMiBLE(msgData,(error,decrypted)=>{
          if (error) {
            return;
          }
          console.log("解密消息内容为 " + JSON.stringify(decrypted));
        });

        this.setState({"bledColor": '#FF0000'}); //先变红色
        setTimeout(() => {
          this.setState({"bledColor": '#330000'}); //再还原颜色
        }, 500);
      }
    }
  }

  _changeNotifyState(characteristic, isOn) {
    // console.log("change " + characteristic.uuid + isOn);
    if (isOn) {
      MHBluetoothLE.enableNotify(characteristic.peripheral, characteristic.service, characteristic.uuid, (error, characteristic) => {
        if(error){
          MHPluginSDK.showFailTips('打开失败');
          this._notifySwitch.setSwichByProps(!isOn);
        }
        this.state.isNotifying = isOn;
      });
    }else {
      MHBluetoothLE.disableNotify(characteristic.peripheral, characteristic.service, characteristic.uuid, (error, characteristic) => {
        if(error){
          MHPluginSDK.showFailTips('关闭失败');
          this._notifySwitch.setSwichByProps(!isOn);
        }
        this.state.isNotifying = isOn;
      });
    }

  }

  _changeLightState(characteristic, isOn) {
    // console.log("characteristic " + JSON.stringify(characteristic));
    var msg = false;
    if (isOn) {
      msg = 'FFFFFFFF';
    }else {
      msg = '00000000';
    }

    //使用标准安全芯片开关接口
    var cmd = 0;
    if (isOn) {
      cmd = 1;
    }
    MHXiaomiBLE.toggleLockXiaoMiBLE(cmd,(error,response)=>{
      if (error) {
        MHPluginSDK.showFailTips("操作失败");
      }
    });

    //如果消息加密发送给带加密芯片设备
    // MHXiaomiBLE.encryptMessageXiaoMiBLE(msg,(error,encrypted)=>{
    //   if (error) {
    //     return;
    //   }
    //   this._writeValue(characteristic,encrypted.string,isOn);
    // });

    //不加密
    // this._writeValue(characteristic,msg,isOn);
  }

  _writeValue(characteristic,msg,isOn){
    // console.log("write " + characteristic.uuid + " " + msg);
    MHBluetoothLE.writeWithoutResponse(characteristic.peripheral, characteristic.service, characteristic.uuid, msg, (error, characteristic) => {
      if (error) {
        // console.log("error " + JSON.stringify(error));
        this._lightSwitch.setSwichByProps(!isOn);
        MHPluginSDK.showFailTips(error.message);
        return;
      }
      else {
        if (isOn) {
          this.setState({"fledColor": '#FF0000'}); //先变红色
        }
        else {
          this.setState({"fledColor": '#330000'}); //先变红色
        }
      }
    });
  }

  //16进制字符串转换为10进制数数组
  _hexStrToByteArr(hexStr) {

    var byteArr = new Array();

    if(!hexStr || !hexStr.length || hexStr.length%2 !== 0){
      return byteArr;
    }
    //把原字符串变成大写字符串
    hexStr = hexStr.toLocaleUpperCase();

    //十六进制常量字符串
    const hexs = '0123456789ABCDEF';

    for (var i = 0; i < hexStr.length/2; i++) {

      var bytePR = hexStr[2*i];
      var byteSF = hexStr[2*i+1];
      //判断次byte是否是合法byte
      if (bytePR.indexOf(hexs) && byteSF.indexOf(hexs)) {
        byteArr.push(parseInt((bytePR+byteSF), 16));
      }
    }

    return byteArr;
  }

  //10进制数组转换为16进制字符串(10进制数接受范围是0~255, 包含0和255)
  _byteArrToHexStr(byteArr) {
    var hexStr = '';

    if (!byteArr || byteArr.length <= 0) {
      return hexStr;
    }

    for (var i = 0; i < byteArr.length; i++) {
      var hexNum = byteArr[i];

      //选取有效数据
      if (hexNum >= 0 && hexNum <= 255) {
        var hexByteStr = hexNum.toString(16).toUpperCase();
        if (hexByteStr.length%2 == 1) {
          hexByteStr = '0'+hexByteStr;
        }
        hexStr = hexStr + hexByteStr;
      }
    }
    return hexStr;
  }
}

var styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#838383',
    marginTop: 66,
  },
  containerIconDemo: {
    flex: 1.2,
    flexDirection: 'column',
    backgroundColor: '#191919',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  containerControll: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
  },
  iconDemo: {
    alignSelf: 'center',
    width: 280,
    height: 200,
  },
  iconText: {
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'center',
    color: '#ffffff',
    marginTop: 13
  },
  RGBResultViewFlash: {
     height: 20,
     width:20,
     marginTop: 99,
     borderWidth: 1,
     borderColor: '#48BBEC',
     alignSelf: 'center',
  },
  RGBResultViewButton: {
     height: 20,
     width:20,
     marginLeft: 10,
     borderWidth: 1,
     borderColor: '#48BBEC',
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
});

var route = {
  key: 'XiaoMiBLEMainPage',
  title: '小米蓝牙开发板控制示例',
  component: XiaoMiBLEMainPage,
  navBarStyle: {
    backgroundColor:'#0f4287',
  },
  navLeftButtonStyle: {
    tintColor:'#ffffff',
  },
  navTitleStyle: {
    color:'#ffffff',
  },
};

module.exports = {
  component: XiaoMiBLEMainPage,
  route: route,
}
