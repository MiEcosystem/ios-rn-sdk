# MiHomePlugin API参考文档
## MHXiaomiBLE模块 `AL-[110,)`

在插件快联开发过程中有部分蓝牙模块使用的是小米蓝牙，由于小米蓝牙的特殊性，我们对使用小米蓝牙模块的设备提供了一个特殊的模块`MHXiaomiBLE` 来更快捷的绑定蓝牙设备到米家客户端。

**只支持使用小米蓝牙模块的设备。**

```js
// 模块初始化
var MHXiaomiBLE = require('NativeModules').MHXiaomiBLE;
```

### 常量
无

### API

#### *registerXiaoMiBLE(did, timeout, callback)*

描述：把设备注册到米家客户端（一般是第一次连接的设备调用此函数，包含绑定设备逻辑）

参数：

* `did` 需要注册到米家客户端的设备ID
* `timeout` 注册超时时间，如果在超时时间内未完成注册则取消注册
* `callback(error, info)` 当注册结束后调用此回调 error表示是否注册成功，info表示注册的设备信息

例子：

```javascript
MHXiaomiBLE.registerXiaoMiBLE('xdffe98sd9', 4, (error, info) => {
  if(error)
    MHPluginSDK.showFailedTips('注册失败：'+error.message);
});
```



#### *loginXiaoMiBLE(did, timeout, callback)*

描述：米家客户端打开并登录设备（一般是打开已连接或者曾经连接过设备调用此函数，包含重新绑定设备逻辑）

参数：

- `did` 需要登录的设备ID
- `timeout` 登录超时时间，如果在超时时间内未完成登录则取消登录
- `callback(error, info)` 当登录结束后调用此回调 error表示是否登录成功，info表示登录的设备信息

例子：

```javascript
MHXiaomiBLE.loginXiaoMiBLE('xdffe98sd9', 4, (error, info) => {
  if(error)
    MHPluginSDK.showFailedTips('登录失败：'+error.message);
});
```



#### *bindXiaoMiBLE(did, callback)*

描述：把设备绑定到米家客户端

参数：

- `did` 需要绑定到米家客户端的设备ID
- `callback(error, info)` 当绑定结束后调用此回调 error表示是否绑定成功，info表示绑定的设备信息

例子：

```javascript
MHXiaomiBLE.bindXiaoMiBLE('xdffe98sd9', (error, info) => {
  if(error)
    MHPluginSDK.showFailedTips('注册失败：'+error.message);
});
```

