import React, { Component } from 'react';
import{ AppRegistry, ScrollView, Image, Text, View ,TouchableHighlight} from 'react-native'
var MHPluginSDK = require('NativeModules').MHPluginSDK;
var MHPluginFS = require('NativeModules').MHPluginFS;
class ScreenShot extends Component {


  screenShot(){
  // MHPluginSDK.showLoadingTips("正在生成分享页");
  // alert("正在截图");
  let findNodeHandle = require('findNodeHandle');
  console.warn(this.refs);
  MHPluginFS.longScreenShot(findNodeHandle(this.refs.listview),'listview',(isSuccess,filepath)=>{
    // MHPluginSDK.showLoadingTips("截图成功");
    // MHPluginSDK.dismissTips();
    alert("截图完毕");
    if (isSuccess) {
      console.warn(filepath);
    }else {
      console.warn('截图失败');
    }

  });
};
  render() {
      return(
        <ScrollView ref='listview'>
          <Text style={{fontSize:96}}>Scroll me plz</Text>

          <Text style={{fontSize:96}}>If you like</Text>

          <Text style={{fontSize:96}}>Scrolling down</Text>

          <Text style={{fontSize:96}}>Whats the best</Text>

          <Text style={{fontSize:96}}>Framework around?</Text>

          <Text style={{fontSize:80}}>React Native</Text>
          <TouchableHighlight onPress = {this.screenShot.bind(this)}>
           <Text>截图</Text>
          </TouchableHighlight>
        </ScrollView>


    );
  }
}

var route = {
  key: 'ScreenShot',
  title: '',
  component: ScreenShot,
}
module.exports = {
  component: ScreenShot,
  route: route,
}
