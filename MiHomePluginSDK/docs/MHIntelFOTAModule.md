# MiHomePlugin API参考文档
## MHIntelFOTAModule模块 `AL-[112,)`

插件通过 MHIntelFOTAModule模块实现IntelFOTAManager类的功能。

```js
// 模块初始化
var MHIntelFOTA = require('NativeModules').MHIntelFOTA;
```

### 常量
#### *event*
MHIntelFOTA 模块所有的消息类型

* event.OTASuccessToConnectDevice  
* event.OTAFailToConnectDevice 
* event.OTAProgressUpdate   回调参数{"progress":""}
* event.OTAStateUpdate   回调参数{"state":""}
* event.OTASuccessUpdate 
* event.OTAFailedUpdate  回调参数{"code": -1,"domain":"errorDomain","userInfo":{}}

``` javascript 
var events = MHIntelFOTA.event;
```




### MHIntelFOTA 的回调机制
### 可以在插件端监听的事件

```javascript
// 监听事件示例代码
var {DeviceEventEmitter} = require('react-native');
var subscription = DeviceEventEmitter.addListener(MHIntelFOTA.event.OTASuccessToConnectDevice ,(notification) => {
  //成功连接代码
});
```



### API
#### *updateFirmwareWithFileURL(fileUrlString, uuid)*
描述：开始固件升级

参数：

* `fileUrlString`  *String*;
* `uuid` *String*




#### *disconnect()*













