
# 状态栏高度变化适配指南

当手机来电/连接热点/微信网络通话的时候，手机的状态栏的高度会从20变成40，这样整个插件页面就会向下移动，可能会造成底部的一些控件被遮盖，这个时候需要做特殊的适配。

```js
const { NativeEventEmitter, StatusBarIOS, NativeModules } = require('react-native');

const { StatusBarManager } = NativeModules;

// 监听状态栏高度变化
componentWillMount() {
    this._statusBarFrameWillChange = DeviceEventEmitter.addListener("statusBarFrameWillChange", (event) => {      
    });
}

// 获取状态栏的高度
StatusBarManager.getHeight((response)=> {
    console.log(response);
});

// 移除监听
componentWillUnmount() {
    this._statusBarFrameWillChange.remove();
}
```
