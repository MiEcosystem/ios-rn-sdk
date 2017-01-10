'use strict';

var React = require('react-native');

var {
  StyleSheet,
  WebView,
  View,
  StatusBar,
  Platform,
  Navigator,
  Text,
  ListView,
  DeviceEventEmitter,
  ScrollView,
} = React;


var DoubleLineRowCell = require('./Cells/DoubleLineRowCell');
var ServiceList = require('./ServiceList');

var MHBluetoothLE = require('NativeModules').MHBluetoothLE;
var MHPluginSDK = require('NativeModules').MHPluginSDK;

const ServiceUUID_NORDIC = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const CharacteristicUUID_READ_NORDIC = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
const CharacteristicUUID_WRITE_NORDIC = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

//指令类型宏定义
const NB_CMDTYPE_RD	      = '01';		//读指令
const NB_CMDTYPE_WR				= '02';		//写指令
const NB_CMDTYPE_WR_NR		= '03';		//写控制表指令（无返回）



const V6_MINI_ID              = '0A';   //mini的ID   = '0A是给Mini发读写命令使用的ID，Mini返回数据时的ID是= '0E
const V6_MINI_BLE_ID          = '0B';   //mini中舱板的ID MINI ble发送ID
const V6_MINI_BMS_ID          = '0C';   //电池的ID  MINI bms发送ID
const V6_MINI_R_ID            = '0D';   //mini数据返回的ID MINI主控读ID
const V6_MINI_BLE_R_ID        = '0E';   //mini中舱板返回数据的ID MINI ble读ID
const V6_MINI_BMS_R_ID        = '0F';   //电池数据返回的ID MINI bms读ID

const NB_FRAME_HEAD = '55'; //数据的开头
const NB_FRAME_HEAD_B = '6C'; //数据的开头B
const NB_FRAME_BEGIN = 'AA'; //数据的开始


//常用车辆信息（方便一次读取）
const NB_QUK_ERROR				= 'B0';		//错误代码
const NB_QUK_ALERM				= 'B1';		//报警代码
const NB_QUK_BOOL					= 'B2';		//布尔状态字
const NB_QUK_WORKMODE				= 'B3';		//当前工作模式
const NB_QUK_BTC					= 'B4';		//整车电量，0~100
const NB_QUK_SPEED				= 'B5';		//当前车辆速度，meter/h
const NB_QUK_AVRSPEED				= 'B6';		//车辆平均速度，meter/h
const NB_QUK_RID_MIL_L			= 'B7';		//总骑行里程低16位，m
const NB_QUK_RID_MIL_H			= 'B8';		//总骑行里程高16位，m
const NB_QUK_RID_MIL_SIG			= 'B9';		//单次骑行里程，10m
const NB_QUK_RUN_TIM_SIG			= 'BA';		//单次运行时间，sec
const NB_QUK_BODY_TEMP			= 'BB';		//车体温度，0.1℃
const NB_QUK_MAX_SPEED            = 'BF';        //最高速度

//车辆信息
const NB_INF_SN					= '10';		//车辆序列号，14Byte，占7组
const NB_INF_BTPASSWORD			= '17';		//蓝牙配对码，6Byte，占3组
const NB_INF_FW_VERSION			= '1A';		//固件版本
const NB_INF_ERROR				= '1B';		//错误代码
const NB_INF_ALERM				= '1C';		//报警代码
const NB_INF_BOOL					= '1D';		//布尔状态字
const NB_INF_WORK_SYS				= '1E';		//当前工作的系统，1或2
const NB_INF_WORKMODE				= '1F';		//当前工作模式
const NB_INF_STEP_SWITCH			= '20';		//站人开关状态
const NB_INF_LINK_ANGLE			= '21';		//手把转角，0.1°

const NB_INF_BTC					= '22';		//整车电量，0~100
const NB_INF_BTC_1				= '23';		//电池1电量，0~100
const NB_INF_BTC_2				= '24';		//电池2电量，0~100
const NB_INF_PRD_RID_MIL			= '25';		//预计剩余骑行里程，10m
const NB_INF_SPEED				= '26';		//当前车辆速度，meter/h
const NB_INF_SPEED_L				= '27';		//当前左轮速度，meter/h
const NB_INF_SPEED_R				= '28';		//当前右轮速度，meter/h

const NB_INF_RID_MIL_L			= '29';		//总骑行里程低16位，m
const NB_INF_RID_MIL_H			= '2A';		//总骑行里程高16位，m
const NB_INF_ASS_MIL_L			= '2B';		//总助力里程低16位，m
const NB_INF_ASS_MIL_H			= '2C';		//总助力里程高16位，m
const NB_INF_REM_MIL_L			= '2D';		//总遥控里程低16位，m
const NB_INF_REM_MIL_H			= '2E';		//总遥控里程高16位，m
const NB_INF_RID_MIL_SIG			= '2F';		//单次骑行里程，10m
const NB_INF_ASS_MIL_SIG			= '30';		//单次助力里程，10m
const NB_INF_REM_MIL_SIG			= '31';		//单次遥控里程，10m

const NB_INF_RID_TIM_SIG			= '3B';		//单次骑行时间，sec
const NB_INF_BODY_TEMP			= '3E';		//车体温度，0.1℃

const NB_INF_AVRSPEED				= '65';		//车辆平均速度，meter/h

const NB_INF_VER_DRIVER			= '66';		//驱动器版本号
const NB_INF_VER_AHRS				= '67';		//AHRS版本号
const NB_INF_VER_DASHBOAR			= '68';		//仪表盘版本号

//车辆控制
const NB_CTL_LOCK					= '70';		//锁车
const NB_CTL_UNLOCK				= '71';		//解锁
const NB_CTL_LIMIT_SPD			= '72';		//限速或放开限速
const NB_CTL_NOMALSPEED			= '73';		//正常模式限速值，meter/h
const NB_CTL_LITSPEED				= '74';		//限速模式限速值，meter/h
const NB_CTL_CALIB_AHRS			= '75';		//进行姿态传感器校准
const NB_CTL_CALIB_SHAFT			= '76';		//进行转向传感器校准
const NB_CTL_ENGINE				= '77';		//启动或者关闭引擎
const NB_CTL_REBOOT				= '78';		//重启系统
const NB_CTL_POWEROFF				= '79';		//关机
const NB_CTL_REMOTE				= '7A';		//进入遥控模式(0,1)
const NB_CTL_REM_SPD				= '7A';		//遥控目标前进速度，meter/h
const NB_CTL_REM_DIF_SPD			= '7A';		//遥控目标差动速度，meter/h
const NB_CTL_REM_MAX_SPD			= '7A';		//遥控最大前进速度，meter/h
const NB_CTL_REM_MAX_DIF_SPD		= '7A';		//遥控最大差动速度，meter/h
const NB_CTL_REM_MAX_ACC			= '7A';		//遥控最大加速度，meter/h/s


const NB_CTL_DOTRENEW				= '9B'; 		//不恢复出厂设置

//控制参数（预留）
const NB_CTL_CLEARMLG				= 'A0'; 		//清零里程和运行时间
const NB_CTL_STR_SENS				= 'A1'; 		//转向灵敏度，1~100，101为自动调整
const NB_CTL_REM_FREEMODE			= 'A2'; 		//是否自由遥控模式
const NB_CTL_GO_STANDBY			= 'A3'; 		//是否下车后直接进入待机模式
const NB_CTL_IS_BIGBAT			= 'A4'; 		//是否是大容量电池
const NB_CTL_LIMIT_ONEFOOT		= 'A5'; 		//是否单脚转向时降低转向速度


const NB_INF_BTNAME				= 'E0';		//蓝牙名称，8Byte，占4组

const NB_CMD_READ_MILS      = '55AA030A012502CAFF'; //读取剩余可行驶里程
const NB_CMD_READ_DRIVETIME = '55AA030A013B02B4FF'; //单次骑行时间

const NB_CMD_READ_INF_SN    = '55AA030A01100ED3FF'; //车辆序列号
const NB_CMD_READ_QUK       = '55AA030A01B02021FF';// NB_QUK_ERROR

//55aa030a 011708d2 ff password



const NULL_DATA_PLEASEHOLDER = '000000000000000000000000000000000000000000000000000000000000\
                                000000000000000000000000000000000000000000000000000000000000\
                                000000000000000000000000000000000000000000000000000000000000\
                                000000000000000000000000000000000000000000000000000000000000\
                                000000000000000000000000000000000000000000000000000000000000\
                                000000000000000000000000000000000000000000000000000000000000\
                                000000000000000000000000000000000000000000000000000000000000\
                                000000000000000000000000000000000000000000000000000000000000\
                                000000000000000000000000000000000000000000000000000000000000';


class NinebotPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      peripheral: this.props.peripheral,
      device: false,
      bleName: '',
      bleRSSI: -1000,
      bleState: '',
      botPower: '0%',
      botSpeed: '0km/s',
      driveTime: '0s',
      driveDistance: '0km',
      totalDistance: '0km',
      botTemp: '0℃',
      botSpeedAvg: '0km/h',
      canDriveMil: '0km',
    };
  }

  componentWillMount() {

    //监听蓝牙连接状态信息
    this._didDisconnectPeripheralListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.centralManager_didDisconnectPeripheral_error, (error, peripheral) => {

      MHPluginSDK.showFailTips('连蓝牙设备已断开连接');

      this.props.navigator.pop();

      if (error) {
        return;
      }

      this.setState({
        bleState: this._getConnectStateStr(peripheral.state),
      });

      //显示重连按钮
    });

    //监听设备名称更改
    this._peripheralDidUpdateNameListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.peripheralDidUpdateName, (error, peripheral) => {
      if (error) {
        return;
      }

      this.setState({
        bleName: peripheral.name,
      });
    });
    //监听设备信号强度改变
    this._peripheralDidUpdateRSSIListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.peripheralDidUpdateRSSI_error, (error, peripheral) => {

      if (error) {
        return;
      }

      this.setState({
        bleRSSI: peripheral.rssi,
      });
    });

    //监听设备信号强度改变
    this._peripheralDidReadRSSIListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.peripheral_DidReadRSSI_error, (error, peripheral) => {

      if (error) {
        return;
      }

      this.setState({
        bleRSSI: peripheral.rssi,
      });
    });

    //监听数据
    this._didUpdateValueForCharacteristicListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.peripheral_didUpdateValueForCharacteristic_error, (body) => {
      var error = body[0];
      var characteristic = body[1];
      var msgData = body[2];
      if (error) {
        MHPluginSDK.showFailTips('获取数据失败:'+JSON.stringify(error));
        return;
      }

      this._handleMsgForNineBot(msgData);

    });
  }

  _getConnectStateStr(state) {
    var connectState = '未知';
    if(state === 'connected'){
      connectState = '已连接';
    }else if(state === 'disconnected'){
      connectState = '未连接';
    }else if(state === 'connecting'){
      connectState = '正在连接';
    }else if(state === 'disconnecting'){
      connectState = '正在断开连接';
    }else{
      connectState = '未知';
    }
    return connectState;
  }

  componentDidMount() {

    //取上个页面传过来的设备
    MHBluetoothLE.getDefaultDevice((error, device) => {
      if (!error) {
        this.state.device = device;
        this.state.peripheral = device.peripheral;

        this._showMainUI(device, device.peripheral);
      }
    });


  }

  _showMainUI(device, peripheral) {

    if(peripheral && peripheral.name){
      this.setState({
        bleName: peripheral.name,
        bleRSSI: peripheral.rssi,
        bleState: this._getConnectStateStr(peripheral.state),
      });

      //读取当前设备的信号强度
      MHBluetoothLE.readRSSI(peripheral.identifier, (error, result) => {

        if (error) {
          return;
        }

        this.setState({
          bleRSSI: peripheral.rssi,
        });
      });
    }



    if (peripheral.state === 'connected') {
      this._startReadAndWrite(peripheral);
    }else {
      MHPluginSDK.showLoadingTips('连接设备中');
      MHBluetoothLE.connectDevice(device.did, (error, peripheral) => {
        MHPluginSDK.dismissTips();
        if (!error) {

          //开始读写数据
          this._startReadAndWrite(peripheral);
        }else {
          MHPluginSDK.showFailTips('连接失败');
        }
      });

    }
  }

  _startReadAndWrite(peripheral) {
    //读取本地的service

    var mainService = false;
    var charaRead = false;
    var charaWrite = false;

    MHBluetoothLE.infoForService(ServiceUUID_NORDIC, peripheral.identifier, (error , service) => {
      if (!error) {
          mainService = service;
          MHBluetoothLE.infoForCharacteristic(CharacteristicUUID_READ_NORDIC, ServiceUUID_NORDIC, peripheral.identifier, (error, chara) => {
            if (!error) {

              charaRead = chara;
              this._startToRead(chara);
            }
          });
      }else {
        this._discoverService(peripheral);
      }
    });
  }

  _discoverService(peripheral) {
    //发起服务请求
    MHBluetoothLE.discoverServices(peripheral.identifier, [ServiceUUID_NORDIC], (error, peripheral, service) => {
      if (error) {
        MHPluginSDK.showFailTips('服务检索失败');
        return;
      }
      this._discorverChara(peripheral);
    });
  };

  _discorverChara(peripheral) {
    //搜索特征，
    MHBluetoothLE.discoverCharacteristics(peripheral.identifier, ServiceUUID_NORDIC, [], (error, service, characteristic) => {
      if (error) {
        MHPluginSDK.showFailTips('建立连接失败');
        return;
      }
      if (characteristic.uuid === CharacteristicUUID_READ_NORDIC) {
        this._startToRead(characteristic);
      }

    });
  };

  _startToRead(characteristic) {
    //alert(JSON.stringify(characteristic));
    if (characteristic.isNotifying) {
      MHBluetoothLE.enableNotify(characteristic.peripheral, characteristic.service, CharacteristicUUID_READ_NORDIC, (error, characteristic, isNotify) => {

      });
      //开始读取数据
      this._getInfoTimer = setInterval(() => {
        this._readDataFromNineBot(characteristic);
      }, 5000);

    }else {
      alert(JSON.stringify(characteristic));
      MHBluetoothLE.enableNotify(characteristic.peripheral, characteristic.service, CharacteristicUUID_READ_NORDIC, (error, characteristic, isNotify) => {
        if (error) {
          MHPluginSDK.showFailTips('打开通知模式失败');
          return;
        }
        MHBluetoothLE.readValue(service.peripheral, service.uuid, CharacteristicUUID_READ_NORDIC, (error, chara, msgData) => {
          if (error) {
            MHPluginSDK.showFilTips('获取数据失败');
            return;
          }

          this._handleMsgForNineBot(msgData);

          //开始读取数据
          this._getInfoTimer = setInterval(() => {
            this._readDataFromNineBot(service);
          }, 5000);
        });

      });
    }

  }
  //不同时间间隔连续读取各项数据
  _readDataFromNineBot(characteristic) {
    setTimeout(() => {
      this._rotSendReadCMD(characteristic, NB_INF_PRD_RID_MIL);
    }, 1000);

    setTimeout(() => {
      this._rotSendReadCMD(characteristic, NB_INF_RID_TIM_SIG);
    }, 2000);

    setTimeout(() => {
      this._rotSendReadCMD(characteristic, NB_INF_SN);
    }, 3000);

    setTimeout(() => {
      this._rotSendReadCMD(characteristic, NB_QUK_ERROR);
    }, 4000);
  }

  _rotSendReadCMD(characteristic, cmd) {
    if (cmd === NB_INF_PRD_RID_MIL) {
      MHBluetoothLE.writeValue(characteristic.peripheral, characteristic.service,  CharacteristicUUID_WRITE_NORDIC, NB_CMD_READ_MILS, (error) => {
        if (error) {
          MHPluginSDK.showFailTips('read total Milston error');
        }
      });
    }else if(cmd === NB_INF_RID_TIM_SIG){
      MHBluetoothLE.writeValue(characteristic.peripheral, characteristic.service,  CharacteristicUUID_WRITE_NORDIC, NB_CMD_READ_DRIVETIME, (error) => {
        if (error) {
          MHPluginSDK.showFailTips('read total Milston error');
        }
      });
    }else if (cmd === NB_INF_SN) {
      MHBluetoothLE.writeValue(characteristic.peripheral, characteristic.service,  CharacteristicUUID_WRITE_NORDIC, NB_CMD_READ_INF_SN, (error) => {
        if (error) {
          MHPluginSDK.showFailTips('read total Milston error');
        }
      });
    }else if (cmd === NB_QUK_ERROR) {
      MHBluetoothLE.writeValue(characteristic.peripheral, characteristic.service,  CharacteristicUUID_WRITE_NORDIC, NB_CMD_READ_QUK, (error) => {
        if (error) {
          MHPluginSDK.showFailTips('read total Milston error');
        }
      });
    }

  }




  //处理数据
  _handleMsgForNineBot(msg) {
    if (msg === undefined) {
      return;
    }
    var msgStr = msg.toUpperCase();

    if (this._isPrefix(msgStr, NB_FRAME_HEAD+NB_FRAME_BEGIN)) {

      msgStr = msgStr.substr(4, msgStr.length-4);

      var dataLen = parseInt(msgStr.substr(0, 2), 16);

      msgStr = msgStr.substr(2, msgStr.length-2);

      //判断是否是主控返回的数据
      var vRID = msgStr.substr(0, 2);

      if (vRID === V6_MINI_R_ID) {
        msgStr = msgStr.substr(2, msgStr.length-2);
        var cmd = msgStr.substr(0, 2);

        if (cmd === NB_CMDTYPE_RD) {
          var index = msgStr.substr(2, 2);

          //校验和多加了一个字节 所以这里从6开始
          var dataStr = msgStr.substr(6, (dataLen - 2)*2);

          if (index === NB_INF_PRD_RID_MIL) { //可行驶里程
            var canDriveMil = parseInt(dataStr, 16)/100;

            this.setState({
              canDriveMil: canDriveMil.toFixed(2)+'km',
            });
          }else if(index === NB_INF_RID_TIM_SIG){ //本次骑行时间
            var driveTime = parseInt(dataStr, 16);

            this.setState({
              driveTime: driveTime.toFixed(2)+'s',
            });
          }else if (index === NB_INF_SPEED) { //当前车速度
            var botSpeed = parseInt(dataStr, 16);
            this.setState({
              botSpeed: botSpeed+'km/s',
            });
          }else if(index === NB_INF_AVRSPEED){ //车辆平均速度
            var botSpeedAvg = parseInt(dataStr, 16);
            this.setState({
              botSpeedAvg: botSpeedAvg+'km/s',
            });
          }else if (index === NB_INF_BODY_TEMP) { //车体温度
            var botTemp = parseInt(dataStr, 16)/10;
            this.setState({
              botTemp: botTemp.toFixed(1)+'℃',
            });
          }else if (index === NB_INF_RID_MIL_SIG) { //单次行驶里程
            var driveDistance = parseInt(dataStr, 16)/100;
            this.setState({
              driveDistance: driveDistance.toFixed(2)+'km',
            });
          }else if(index === NB_INF_SN){ //序列号信息
            //alert('un handled unknown index msg:' + msgStr);
          }else if (index === NB_QUK_ERROR) {
            this.setState({
              botPower: (100 - parseInt(dataStr.substr(2*4, 2), 16)) + '%',
              botSpeed: (parseInt(dataStr.substr(2*5, 2), 16)/100).toFixed(2) + 'km/s',
              botSpeedAvg: (parseInt(dataStr.substr(2*6, 2), 16)/100).toFixed(2) + 'km/s',
              totalDistance: parseInt((dataStr.substr(2*8, 2)+dataStr.substr(2*7, 2)), 16).toFixed(2) + 'km',
              driveDistance: (parseInt(dataStr.substr(2*9, 2), 16)/100).toFixed(2) + 'km',
              driveTime: (parseInt(dataStr.substr(2*10, 2), 16)) + 's',
              botTemp: (parseInt(dataStr.substr(2*11, 2), 16)*10).toFixed(1) + '℃',
            });
          }
        }else {
          //alert('un handled unknown cmd msg:' + msgStr);
        }

      }else{
        //alert('un handled unknown id msg:' + msgStr);
      }

    }else {

    }
  }


   render() {
     return (
       <View style={styles.container} >
         <StatusBar barStyle='light-content' />
         <View style={styles.listHeader} >
           <Text></Text>
         </View>
         <ScrollView style={styles.containerMenu}>
            <DoubleLineRowCell title='名称：' description={this.state.bleName} key='name' showLine={true}
             disabled={true} />
           <DoubleLineRowCell title='RSSI：' description={this.state.bleRSSI} key='rssi' showLine={true}
             disabled={true} />
           <DoubleLineRowCell title='状态：' description={this.state.bleState} key='state' showLine={true}
             disabled={true} />
           <DoubleLineRowCell title='剩余里程：' description={this.state.canDriveMil} key='canDriveMil' showLine={true}
             disabled={true} />
           <DoubleLineRowCell title='本次骑行时间：' description={this.state.driveTime} key='driveTime' showLine={true}
             disabled={true} />
           <DoubleLineRowCell title='车子剩余电量：' description={this.state.botPower} key='botPower' showLine={true}
             disabled={true} />
           <DoubleLineRowCell title='本次行驶里程：' description={this.state.driveDistance} key='driveDistance' showLine={true}
             disabled={true} />
           <DoubleLineRowCell title='总的行驶里程：' description={this.state.totalDistance} key='totalDistance' showLine={true}
             disabled={true} />
           <DoubleLineRowCell title='车体当前温度：' description={this.state.botTemp} key='botTemp' showLine={true}
             disabled={true} />
           <DoubleLineRowCell title='平均行驶速度：' description={this.state.botSpeedAvg} key='botSpeedAvg' showLine={true}
             disabled={true} />
           <DoubleLineRowCell title='当前行驶速度：' description={this.state.botSpeed} key='botSpeed' showLine={true}
             disabled={true} />
         </ScrollView>
       </View>
     )
   }

   //命令区分
   _formatCMDForWrite(id, datalen, cmd, index) {

     var cmdStr = '';

     //将要发送的数据帧压入队列
     cmdStr = cmdStr + this._toHexStr(datalen+2);
     cmdStr = cmdStr + id;
     cmdStr = cmdStr + cmd;
     cmdStr = cmdStr + index;
     for (var i=0; i<datalen; i++)
     {
         cmdStr = cmdStr + '00';
     }

     //校验和
     var csum = this._checkSum(cmdStr, cmdStr.length);

     cmdStr = NB_FRAME_HEAD + NB_FRAME_BEGIN + cmdStr;


     cmdStr += this._toHexStr(csum&parseInt('FFFF', 16));

     cmdStr += this._toHexStr((csum>>8)&parseInt('FFFF', 16));

     return cmdStr;
   }

   //判断是否包含某前缀
   _isPrefix(p, s) {
     return p.indexOf(s) === 0;
   }

   //将一个数字转化成16进制字符串形式
   _toHexStr(num){
     var hexNumStr = '';
     if (num < 0) {
       hexNumStr = (num>>>0).toString(16).toUpperCase();
     }else {
       hexNumStr = num.toString(16).toUpperCase();
     }

      if (hexNumStr.length%2 == 1) {
        return '0'+hexNumStr;
      }
   	 return hexNumStr;
   }
   //对数据校验
   _checkSum(dataStr ,len) {
     var sum = 0;
     var i = 0;
     for(i=0; i<len; i=i+2){
       var hexStr = dataStr[i]+dataStr[i+1];
       sum = sum + parseInt(hexStr, 16);
     }
     sum = ~sum;

     return sum;
   }


   componentWillUnmount() {
     MHBluetoothLE.disconnect(this.state.peripheral.identifier, (error) => {

     });
     this._didDisconnectPeripheralListener.remove();
     this._peripheralDidUpdateNameListener.remove();
     this._peripheralDidReadRSSIListener.remove();
     this._peripheralDidUpdateRSSIListener.remove();

     clearInterval(this._getInfoTimer);
   }

}

var styles = StyleSheet.create({
  container: {
      marginTop: Platform.OS === 'ios' ? 64 : 76,
      flexDirection:'row',
      flex:1,
  },
  containerMenu: {
    flex: 1,
    marginTop: 0,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
  },
  listHeader: {
    height: 64,
    backgroundColor: '#0f4287',
  }
});

var route = {
  key: 'NinebotPage',
  title: 'NineBot',
  component: NinebotPage,
  sceneConig: {
    ...Navigator.SceneConfigs.FloatFromRight,
    gestures: {}, // 禁止左划
  },
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
};

module.exports = {
  component: NinebotPage,
  route: route,
};
