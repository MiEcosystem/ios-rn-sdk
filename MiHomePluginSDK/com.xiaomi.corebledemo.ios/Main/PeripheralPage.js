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
} = React;


var DoubleLineRowCell = require('./Cells/DoubleLineRowCell');
var ServiceList = require('./ServiceList');

var MHBluetoothLE = require('NativeModules').MHBluetoothLE;

class PeripheralPage extends React.Component {

  constructor(props, context) {
    super(props, context);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentWillMount() {

    var peripheral = this.props.peripheral;

    if(peripheral && peripheral.name){

      var connectState = '未知';
      if(peripheral.state === 'connected'){
        connectState = '已连接';
      }else if(peripheral.state === 'disconnected'){
        connectState = '未连接';
      }else if(peripheral.state === 'connecting'){
        connectState = '正在连接';
      }else if(peripheral .state === 'disconnecting'){
        connectState = '正在断开连接';
      }else{

      }

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(
          [{'title':'名词', 'key':'name', 'value': peripheral.name},
           {'title':'RSSI', 'key':'rssi', 'value': peripheral.rssi +'dbm'},
           {'title':'状态', 'key':'state', 'value': peripheral.state+'('+connectState+')'},
           {'title':'服务', 'key':'services', 'value': ''},
           {'title':'UUID', 'key':'identifier', 'value': peripheral.identifier}]
       )
     });

     MHBluetoothLE.readRSSI(peripheral.identifier, (error, result) => {
       //alert(JSON.stringify(result));
     });
    }
  }

  componentWillUnmount() {
    MHBluetoothLE.disconnect(this.props.peripheral.identifier, () => {});
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
             if (rowData.key == 'services') {
               return(
                 <DoubleLineRowCell title={rowData.title} description={rowData.value} key={rowData.key} showLine={true}
                  arrowSource={this.props.app.sourceOfImage("sub_arrow.png")}
                  onTouchUpInside={() => {
                    this.props.navigator.push({
                      ...ServiceList.route,
                      passProps: {
                        peripheral: this.props.peripheral,
                        message: 'amazing!',
                      },
                    });
                  }}
                />
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
  key: 'PeripheralPage',
  title: '设备页面',
  component: PeripheralPage,
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
  component: PeripheralPage,
  route: route,
};
