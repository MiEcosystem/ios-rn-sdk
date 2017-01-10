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
  Alert,
  DeviceEventEmitter,
} = React;


var DoubleLineRowCell = require('./Cells/DoubleLineRowCell');
var DoubleLineButtonCell = require('./Cells/DoubleLineButtonCell');

var DescriptorPage = require('./DescriptorPage');
var DescriptorList = require('./DescriptorList');

var MHBluetoothLE = require('NativeModules').MHBluetoothLE;
var MHPluginSDK = require('NativeModules').MHPluginSDK;

class CharacteriscticPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isRead: false,
      isNotify: false,
      readValue: '',
    };
  }

  componentWillMount() {

    var characteristic = this.props.characteristic;
    var peripheral = this.props.peripheral;

    if(characteristic){

      var state = '未知';
      if(characteristic.properties === 'read'){
        state = '读';
      }else if(characteristic.properties === 'write'){
        state = '写';
      }else if(characteristic.properties=== 'notify'){
        state = '订阅';
      }else if(characteristic.properties=== 'broadcast'){
        state = '广播';
      }else if(characteristic.properties === 'indicate'){
        state = '指示';
      }else if (characteristic.properties === 'writeWithoutResponse') {
        state = '';
      }else if (characteristic.properties === 'authenticatedSignedWrites') {
        state = '';
      }else if (characteristic.properties === 'extendedProperties') {
        state = '';
      }else if (characteristic.properties === 'notifyEncryptionRequired') {
        state = '';
      }else if (characteristic.properties === 'indicateEncryptionRequired') {
        state = '';
      }else{

      }


      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(
          [{'title':'所属设备:', 'key':'peripheral', 'value': characteristic.peripheral},
           {'title':'所属服务:', 'key':'service', 'value': characteristic.service},
           {'title':'UUID:', 'key':'uuid', 'value': characteristic.uuid},
           {'title':'类型:', 'key':'properties', 'value': state},
           {'title':'可通知:', 'key':'notify', 'value': characteristic.notify?'是':'否'},
           {'title':'可广播:', 'key':'broadcast', 'value': characteristic.broadcast?'是':'否'},
           {'title':'描述列表:', 'key':'descriptors', 'value': ''},
           {'title':'Value:', 'key':'value', 'value':''}]
       )
     });
    }

    this._didUpdateValueForCharacteristicListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.peripheral_didUpdateValueForCharacteristic_error, (result) => {
      if (this.state.isRead) {
        var error = result[0];
        if (!error) {
          var characteristic = result[1];
          var msg = result[2];
          this.setState({
            readValue: msg
          });
        }
      }
    });

    this._didUpdateNotificationStateForCharacteristicListener = DeviceEventEmitter.addListener(MHBluetoothLE.event.peripheral_didUpdateNotificationStateForCharacteristic_error, (result) => {
      alert(JSON.stringify(result));
      if (this.state.isNotify) {
        var error = result[0];
        if (!error) {

        }
      }
    });
  }

   componentWillUnmount () {
     this._didUpdateValueForCharacteristicListener.remove();
     this._didUpdateNotificationStateForCharacteristicListener.remove();
   }
   render() {
     return (
       <View style={styles.container} >
         <StatusBar barStyle='light-content' />
         <View style={styles.listHeader} >
           <Text></Text>
         </View>
         <ListView
           dataSource={this.state.dataSource}
           renderRow={(rowData) => {
             if (rowData.key == 'descriptors') {
               return(
                 <DoubleLineRowCell title={rowData.title} description={rowData.value} key={rowData.key} showLine={true}
                  arrowSource={this.props.app.sourceOfImage("sub_arrow.png")}
                  onTouchUpInside={() => {
                    this.props.navigator.push({
                      ...DescriptorList.route,
                      passProps: {
                        peripheral: this.props.peripheral,
                        service: this.props.service,
                        characteristic: this.props.characteristic,
                        message: 'amazing!',
                      },
                    });
                  }}
                />
               );
             }else if (rowData.key == 'properties') {
               if (this.props.characteristic.properties == 'read') {
                 return(
                   <DoubleLineButtonCell title={rowData.title} description={rowData.value} key={rowData.key} showLine={true}
                     disabled={false} buttonTitle='读取' onTouchUpInside={() =>{
                       Alert.alert(
                         '提示',
                         '是否开始读取数据？',
                         [
                           {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                           {text: 'OK', onPress: () => {
                             var characteristic = this.props.characteristic;
                             this.state.isRead = true;
                             MHBluetoothLE.readValue(characteristic.peripheral, characteristic.service, characteristic.uuid, (error, chara, msg) => {
                               if (!error) {
                                 alert(JSON.stringify(msg));
                               }else {
                                  alert('error:'+error.message+JSON.stringify(chara));
                               }
                             });
                           }},
                         ]
                       )
                     }}/>
                 );
               }else if (this.props.characteristic.properties == 'write') {
                 return(
                   <DoubleLineButtonCell title={rowData.title} description={rowData.value} key={rowData.key} showLine={true}
                     disabled={false} buttonTitle='写入' onTouchUpInside={() =>{
                       Alert.alert(
                         '提示',
                         '是否向设备写入数据？',
                         [
                           {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                           {text: 'OK', onPress: () => {
                             var characteristic = this.props.characteristic;
                             this.state.isRead = true;
                             MHBluetoothLE.writeValue(characteristic.peripheral, characteristic.service, characteristic.uuid, '23f8', (error, chara) => {
                               if (!error) {
                                 MHPluginSDK.showFinishTips('写入成功');
                               }else {
                                  alert('error:'+error.message+JSON.stringify(chara));
                               }

                             });
                           }},
                         ]
                       )
                     }}/>
                 );
               }else if (this.props.characteristic.properties == 'notify') {
                 return(
                   <DoubleLineButtonCell title={rowData.title} description={rowData.value} key={rowData.key} showLine={true}
                     disabled={false} buttonTitle='监听' onTouchUpInside={() =>{
                       Alert.alert(
                         '提示',
                         '是否开始监听设备？',
                         [
                           {text: '关闭', onPress: () => {
                             var characteristic = this.props.characteristic;
                             MHBluetoothLE.disableNotify(characteristic.peripheral, characteristic.service, characteristic.uuid, (error, chara, isNotify) => {

                               if (!error) {
                                 MHPluginSDK.showFinishTips('关闭监听');
                                 this.state.isNotify = false;
                               }else {
                                  alert('error:'+error.message+JSON.stringify(chara));
                               }

                             });
                           }, style: 'cancel'},
                           {text: '打开', onPress: () => {
                             var characteristic = this.props.characteristic;
                             MHBluetoothLE.enableNotify(characteristic.peripheral, characteristic.service, characteristic.uuid, (error, chara, isNotify) => {
                               if (!error) {
                                 MHPluginSDK.showFinishTips('开始监听');
                                 this.state.isNotify = true;
                                 this.setState({
                                   readValue: msg
                                 });
                               }else {
                                  alert('error:'+error.message+JSON.stringify(chara));
                               }

                             });
                           }},
                         ]
                       )
                     }}/>
                 );
               }else {
                 return(
                   <DoubleLineRowCell title={rowData.title} description={rowData.value} key={rowData.key} showLine={true}
                     disabled={true} />
                 );
               }

             }else if (rowData.key == 'value') {
               return(
                 <DoubleLineRowCell title={rowData.title} description={this.state.readValue} key={rowData.key} showLine={true}
                   disabled={true} />
               );
             }else {
               return(
                 <DoubleLineRowCell title={rowData.title} description={rowData.value} key={rowData.key} showLine={true}
                   disabled={true} />
               );
             }

            }
          }
         />
       </View>
     )
   }

}

var styles = StyleSheet.create({
  container: {
      marginTop: Platform.OS === 'ios' ? 64 : 76,
      flexDirection:'row',
      flex:1,
  },
  listHeader: {
    height: 64,
    backgroundColor: '#0f4287',
  }
});

var route = {
  key: 'CharacteriscticPage',
  title: '特征信息',
  component: CharacteriscticPage,
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
  component: CharacteriscticPage,
  route: route,
};
