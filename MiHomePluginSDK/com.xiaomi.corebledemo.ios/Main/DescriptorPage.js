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

var MHBluetoothLE = require('NativeModules').MHBluetoothLE;
var MHPluginSDK = require('NativeModules').MHPluginSDK;

class DescriptorPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isRead: false,
      isNotify: false,
    };
  }

  componentWillMount() {

    var descriptor = this.props.descriptor;
    var peripheral = this.props.peripheral;

    if(descriptor){

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(
          [{'title':'所属设备:', 'key':'peripheral', 'value': descriptor.peripheral },
           {'title':'所属服务:', 'key':'service', 'value': descriptor.service },
           {'title':'所属特征', 'key':'characteristic', 'value': descriptor.characteristic },
           {'title':'UUID:', 'key':'uuid', 'value': descriptor.uuid },
           {'title':'描述:', 'key':'value', 'value': JSON.stringify(descriptor.value) }]
       )
     });
    }

  }

   componentWillUnmount () {

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
             if (rowData.key == 'value') {
               return(
                 <DoubleLineButtonCell title={rowData.title} description={rowData.value} key={rowData.key} showLine={true}
                   disabled={false} buttonTitle='读写' onTouchUpInside={() =>{
                     Alert.alert(
                       '提示',
                       '是否开始读写描述数据？',
                       [
                         {text: '读取', onPress: () => {
                           var descriptor = this.props.descriptor;
                           MHBluetoothLE.readDescriptorValue(descriptor.peripheral, descriptor.service, descriptor.characteristic, descriptor.uuid, (error, result, body) => {
                             if (!error) {
                               alert(JSON.stringify(body));
                             }else {
                                alert('error:'+error.message+JSON.stringify(result));
                             }
                           });
                         }},
                         {text: '修改', onPress: () => {
                           var descriptor = this.props.descriptor;
                           MHBluetoothLE.writeDescriptorValue(descriptor.peripheral, descriptor.service, descriptor.characteristic, descriptor.uuid, '9f085a', (error, result) => {
                             if (error) {
                               alert(JSON.stringify(error));
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
  key: 'DescriptorPage',
  title: '描述信息',
  component: DescriptorPage,
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
  component: DescriptorPage,
  route: route,
};
