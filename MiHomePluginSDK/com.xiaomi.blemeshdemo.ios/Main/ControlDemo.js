'use strict';

const React = require('react-native');
const {
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

const MHPluginSDK = require('NativeModules').MHPluginSDK;

class ControlDemo extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.did = MHPluginSDK.deviceId,
    this.model = MHPluginSDK.deviceModel,
    this.basePath = MHPluginSDK.basePath,
    this.devMode = MHPluginSDK.devMode,

    this.state = {

    };
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <View style={styles.containerAll}>
        <StatusBar barStyle='default' />
        <View style={styles.containerIconDemo}>
          <Image style={styles.iconDemo} source={{uri:this.basePath + "icon_demo.png"}} />
        </View>

        <View style={styles.containerRGB}>
            <TouchableHighlight style={styles.commandButton}  underlayColor='#00ac8c' onPress={()=>this._getStatus()}>
                <Text style={styles.commandButtonText}>发送 获取状态 指令</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.commandButton}  underlayColor='#00ac8c' onPress={()=>this._setPowerOff()}>
                <Text style={styles.commandButtonText}>发送 关灯 指令</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.commandButton}  underlayColor='#00ac8c' onPress={()=>this._setPowerOn()}>
                <Text style={styles.commandButtonText}>发送 开灯 指令</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.commandButton}  underlayColor='#00ac8c' onPress={()=>this._changeBrightness()}>
                <Text style={styles.commandButtonText}>发送 随机亮度 指令</Text>
            </TouchableHighlight>
        </View>
      </View>
    );
  }

  //设备参数参考具体设备的 spec，此处 demo 以灯为例
  _getStatus(){
    let params = [{"did":MHPluginSDK.deviceId, "siid":2, "piid":1}];
    this._cmdGet(params);
  }

  _setPowerOff(){
    let params = [{"did":MHPluginSDK.deviceId, "siid":2, "piid":1, "value":false}];
    this._cmdSet(params);
  }

  _setPowerOn(){
    let params = [{"did":MHPluginSDK.deviceId, "siid":2, "piid":1, "value":true}];
    this._cmdSet(params);
  }

  _changeBrightness(){
    let number = Math.floor(Math.random() * 100) + 1;
    let params = [{"did":MHPluginSDK.deviceId, "siid":2, "piid":2, "value":number}];
    this._cmdSet(params);
  }

  _cmdGet(params){
    MHPluginSDK.callSpecMethod('get_properties',params,(success,response)=>{
      if (!success) {

        return;
      }

    });
  }

  _cmdSet(params){
    MHPluginSDK.callSpecMethod('set_properties',params,(success,response)=>{
      if (!success) {

        return;
      }

    });
  }

}

const styles = StyleSheet.create({
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
  containerRGB: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
  },
  iconDemo: {
    alignSelf: 'center',
    width: 192,
    height: 177,
  },

  commandButton: {
    marginTop: 13,
    height: 40,
    width: 314,
    alignSelf: 'center',
    backgroundColor:'#00bc9c',
    borderRadius:20,
    justifyContent:'center'
  },

  commandButtonText:{
    backgroundColor:"transparent",
    alignSelf:'center',
    fontSize:16,
    color:"#fff"
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

const route = {
  key: 'ControlDemo',
  title: '控制示例',
  component: ControlDemo,
};

module.exports = {
  component: ControlDemo,
  route: route,
}
