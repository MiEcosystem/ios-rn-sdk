插件在热点or 来电的时候UI的适配

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