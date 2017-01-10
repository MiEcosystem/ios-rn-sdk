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
var CharacteristicPage = require('./CharacteristicPage');

var ImageButton = require('../CommonModules/ImageButton');
var DoubleLineColumnCell = require('./Cells/DoubleLineColumnCell');
var DoubleLineArrowCell = require('./Cells/DoubleLineArrowCell');
var DoubleLineRowCell = require('./Cells/DoubleLineRowCell');

var MHBluetoothLE = require('NativeModules').MHBluetoothLE;

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class CharacteristicList extends React.Component {
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
            //判断：read write notify
              return(
                <DoubleLineRowCell title='Characteristic UUID:' description={rowData.uuid} showLine={true}
                  arrowSource={this.props.app.sourceOfImage("sub_arrow.png")}
                  onTouchUpInside={() => {
                    this.props.navigator.push({
                      ...CharacteristicPage.route,
                      passProps: {
                        peripheral: this.props.peripheral,
                        service: this.props.service,
                        characteristic: rowData,
                        message: 'amazing!',
                      },
                    });
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

  componentWillMount() {

    //DeviceEventEmitter.addListener('didDiscoverPeripheral', (perpheral) => this._showDevicelist(perpheral));


  };

  componentDidMount() {
    var service = this.props.service;
    if (service) {
      MHBluetoothLE.isEnabled((enable) => {
        if(enable){
          MHPluginSDK.showLoadingTips('搜索可用特征');
          MHBluetoothLE.discoverCharacteristics(service.peripheral, service.uuid, [], (error, peri, characteristics) => {
            if (error) {
              MHPluginSDK.showFailTips('查找失败');
            }else {
              MHPluginSDK.showFinishTips('搜索完成');
              this.setState({dataSource: this.state.dataSource.cloneWithRows(
                this._genRows(characteristics)
              )});
            }
          });
        }
      });
    }else {
      //this.props.navigator.pop();
    }

  }

  _genRows(characteristics) {
    var list = new Array();

    if(list){
      for(var index in characteristics){
        list.push(characteristics[index]);
      }
    }
    return list;
  };

  componentWillUnmount() {

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


// 打开更多菜单
var openMorePage = function (navigator) {
  navigator.push(MoreMenu.route);
};

// 每个页面export自己的route
var route = {
  key: 'CharacteristicList',
  title: '特征列表',
  component: CharacteristicList,
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
}

module.exports = {
  component: CharacteristicList,
  route: route,
}
