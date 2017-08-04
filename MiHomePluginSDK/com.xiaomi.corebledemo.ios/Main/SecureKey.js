import React, { Component } from 'react';
import{ AppRegistry, StyleSheet, ScrollView, StatusBar, Image, Text, View ,TouchableHighlight,TextInput} from 'react-native'
var MHPluginSDK = require('NativeModules').MHPluginSDK;
var MHPluginFS = require('NativeModules').MHPluginFS;

class SecureKey extends Component {
  constructor(props, context) {
    super(props, context);

    this.basePath = MHPluginSDK.basePath;
    this.state = {
      isShareDevice: false,
      uidToShare:null,
    };
  }

  componentDidMount() {
    this._checkDevice();
  }

  render() {
      return(
        <View style={styles.container}>
          <Text style={[styles.shareText,{opacity:this.state.isShareDevice ? 1:0}]} >设备来自分享，不能再分享，可直接登录</Text>
          <TextInput placeholder = "输入小米id" style={[styles.textInput,{opacity:this.state.isShareDevice ? 0:1}]}  onChangeText={(text) => this.setState({uidToShare:text})}/>
          <TouchableHighlight underlayColor="#0A3C78" onPress={this._onPressButton.bind(this)} style={[styles.button,{opacity:this.state.isShareDevice ? 0:1}]}><Text style={[styles.shareButtonText,{opacity:this.state.isShareDevice ? 0:1}]}>分享</Text></TouchableHighlight>
        </View>
    );
  }

  _checkDevice(){
    if (MHPluginSDK.userId != MHPluginSDK.ownerId){
      this.setState({
        isShareDevice:true,
      });
    }
  }

  _onPressButton(){
    //示例分享一个有效期为3600s的暂时电子钥匙
    var nowTimestamp = Math.floor(Date.now() / 1000);
    MHPluginSDK.shareSecureKey(MHPluginSDK.deviceId,this.state.uidToShare, 1, nowTimestamp, nowTimestamp + 3600,[],(isSuccess,response)=>{
      if (isSuccess) {
        MHPluginSDK.showFinishTips("成功分享给用户"+this.state.uidToShare.toString());
      }
      else{
        MHPluginSDK.showFinishTips("分享失败");
        //打印失败原因
        console.log("error " + JSON.stringify(response));
      }
    });
  }

}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  shareText: {
    fontSize: 22,
    textAlign: 'center',
    color: '#000',
    margin:40,
    marginTop: 200,
    lineHeight:30,
  },
  textInput:{
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin:80,
    marginTop:0,
    padding:10,
  },
  button:{
    backgroundColor:'#0f4287',
    marginLeft:128,
    marginRight:128,
    padding:6,
    borderRadius:6,
  },
  shareButtonText:{
    fontSize:18,
    margin:8,
    color:'#fff',
    textAlign:'center',
  }
});

var route = {
  key: 'SecureKey',
  title: '电子钥匙分享示例',
  component: SecureKey,
  navBarStyle: {
    backgroundColor:'#0f4287',
  },
  navLeftButtonStyle: {
    tintColor:'#ffffff',
  },
  navTitleStyle: {
    color:'#ffffff',
  },
}
module.exports = {
  component: SecureKey,
  route: route,
}