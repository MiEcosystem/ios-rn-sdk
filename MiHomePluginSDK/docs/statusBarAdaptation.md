# 插件在热点或者来电的时候UI的适配指南

当手机来电或者连接 热点的时候，手机的状态栏的高度会从20变成40，
这样整个插件页面就会下移动，可能会造成底部的一些控件被遮盖。这个时候需要做特殊的适配


```

const { NativeEventEmitter, StatusBarIOS, NativeModules } = require('react-native');

const { StatusBarManager } = NativeModules;

//  添加状态栏高度变化通知
componentWillMount() {
   DeviceEventEmitter.addListener("statusBarFrameWillChange", (event) => {
            
    }); 

// 获取 状态栏的高度
StatusBarManager.getHeight((respoense)=> {

      console.log(respoense)
    })
  }

 
// 移除通知
 componentWillUnmount() {
    this._statusBarFrameWillChange.remove();
 }

```
