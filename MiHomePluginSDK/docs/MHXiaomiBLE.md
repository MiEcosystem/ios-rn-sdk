# MiHomePlugin API参考文档
## MHXiaomiBLE模块 `AL-[111,)`

在米家扩展程序快联开发过程中有部分蓝牙模块使用的是小米蓝牙，由于小米蓝牙的特殊性，我们对使用小米蓝牙模块的设备提供了一个特殊的模块`MHXiaomiBLE` 来更快捷的绑定蓝牙设备到米家客户端。

**只支持使用小米蓝牙模块的设备。并注意正确处理蓝牙的连接与断开。用户退出扩展程序时，必须断开连接。**

```js
// 模块初始化
var MHXiaomiBLE = require('NativeModules').MHXiaomiBLE;
```

### 常量
*didFoundXiaoMiBLEDevice* 发现小米某model的蓝牙设备通知

```javascript
MHXiaomiBLE.didFoundXiaoMiBLEDevice
```



### API

#### *getDefaultDevice(callback)*

描述：获取默认的蓝牙设备属性

参数：

* `callback(error, device)` error表示是否有错误，device表示默认设备

例子：

```javascript
MHXiaomiBLE.getDefaultDevice((error, device) => {
  if(error){
    MHPluginSDK.showFailedTips('获取失败：'+error.message);
  }
});
```



#### *scanXiaoMiBLE(model, timeout, callback)*

描述：搜索某model的小米蓝牙设备

参数：

* `model` 设备的model
* `callback(error, timeout, devices)` error 是否有错误，timeout搜索时间，devices搜索结果

例子：

```javascript
MHXiaomiBLE.scanXiaoMiBLE('xiaomo.rocket.v1',4, (error, device) => {
  if(error){
    MHPluginSDK.showFailedTips('搜索失败：'+error.message);
  }
});
```

搜索结果在设定时间之后调用callback把结果返回，每当MHXiaomiBLE模块搜索到一个符合条件的设备的时候会发生通知MHXiaomiBLE.didFoundXiaoMiBLEDevice, 可以监听该通知以实时获取搜索到的设备。

#### *registerXiaoMiBLE(did,mac, timeout, callback)*

描述：把设备注册到米家客户端（一般是第一次连接的设备调用此函数，包含绑定设备逻辑）

参数：

* `did` 需要注册到米家客户端的设备ID
* `mac` 设备的mac地址
* `timeout` 注册超时时间，如果在超时时间内未完成注册则取消注册
* `callback(error, info)` 当注册结束后调用此回调 error表示是否注册成功，info表示注册的设备信息

例子：

```javascript
MHXiaomiBLE.registerXiaoMiBLE('xdffe98sd9', '09:09:09:09:09', 10, (error, info) => {
  if(error){
  	MHPluginSDK.showFailedTips('注册失败：'+error.message);  
  }
});
```



#### *loginXiaoMiBLE(did,mac, timeout, callback)*

描述：米家客户端打开并登录设备（一般是打开已连接或者曾经连接过设备调用此函数，包含重新绑定设备逻辑）

参数：

- `did` 需要登录的设备ID
- `mac` 设备的mac地址
- `timeout` 登录超时时间，如果在超时时间内未完成登录则取消登录
- `callback(error, info)` 当登录结束后调用此回调 error表示是否登录成功，info表示登录的设备信息

例子：

```javascript
MHXiaomiBLE.loginXiaoMiBLE('xdffe98sd9', '09:09:09:09:09', 10, (error, info) => {
  if(error){
  	MHPluginSDK.showFailedTips('登录失败：'+error.message); 
  }
});
```
注意，若登录失败，请查看 `error` 中的 `code` 错误码，错误码说明如下：

`0` — 设备无法连接

`1` — 设备登录时蓝牙连接断开

`2` —  蓝牙读写失败

`3` —  token 发生变化导致的失败，需要重新注册获取新的 token 

`4` —  成功，一般不会出现在 `error` 中

`5` —  未知错误

`6` —  **设备被重置，有安全风险，请提醒用户使用 APP 解绑设备，并重新添加**

`7` — 未获取到有效的电子钥匙

`8` — 设备数字证书不可信


#### *bindXiaoMiBLE(did,mac, callback)*

描述：把设备绑定到米家客户端

参数：

- `did` 需要绑定到米家客户端的设备ID
- `mac` 设备的mac地址
- `callback(error, info)` 当绑定结束后调用此回调 error表示是否绑定成功，info表示绑定的设备信息

例子：

```javascript
MHXiaomiBLE.bindXiaoMiBLE('xdffe98sd9', '09:09:09:09:09', (error, info) => {
  if(error){
   	MHPluginSDK.showFailedTips('注册失败：'+error.message); 
  }
});
```

#### *disconnectXiaoMiBLE(did, mac, callback)*

描述：设备断开连接

参数：

- `did` 设备ID
- `mac` 设备的mac地址
- `callback(error, info)` 断开结束后调用此回调 error表示是否绑定成功，info表示绑定的设备信息

例子：

```javascript
MHXiaomiBLE.disconnectXiaoMiBLE('xdffe98sd9', '09:09:09:09:09', (error, info) => {
  
});
```

#### *encryptMessageXiaoMiBLE*(*message*,  *callback*) `AL-[125,)`

描述：支持小米加密芯片的蓝牙设备，使用此方法将明文加密为密文后，可发送给设备

参数：

- `message` 待加密的明文

- `callback(error,encrypted)` 加密回调，error 表示是否成功，encrypted 表示加密后的数据

  例子：

  ```javascript
  MHXiaomiBLE.encryptMessageXiaoMiBLE(msg,(error,encrypted)=>{
    if (error) {
      // 出错
      return;
    }
    //console.log(encrypted.string);
  });
  ```

#### *decryptMessageXiaoMiBLE*(*encrypted*, *callback*) `AL-[125,)`

描述：支持小米加密芯片的蓝牙设备，使用此方法，可将从设备接收的密文解密

参数：

- `encrypted` 待解密密文

- `callback(error,message)` 解密回调，error 表示是否成功，message 表示解密后的数据

  例子：

  ```javascript
  MHXiaomiBLE.decryptMessageXiaoMiBLE(message,(error,decrypted)=>{
    if (error) {
      //出错
      return;
    }
    //console.log("解密消息内容为 " + JSON.stringify(decrypted));
  });
  ```

#### *toggleLockXiaoMiBLE(cmd,timeoutInterval,callback)* `AL-[125,)`

描述：小米安全芯片门锁便捷开关

参数：

- `cmd` 操作命令，可传入 `0` ，`1` ，`2`三个 int 值，分别代表 开锁，上锁，反锁

- `timeoutInterval` 超时时间，类型为 float，单位为秒，若对应时间过去后仍没有回到设备的开关锁回复，则 callback 返回超时 error

- `callback(error,message)` 回调，error 表示是否成功

  例子：

  ```javascript
  MHXiaomiBLE.toggleLockXiaoMiBLE(1,2.0,(error, message)=>{
    if (error) {
      //出错
      return;
    }
    //console.log("上锁成功");
  });
  ```


#### *secureTokenMD5(callback)*`AL-[125,)`

描述：支持小米加密芯片的蓝牙设备，使用此方法，可获得设备注册后，生成的 token 的 MD5 值

- `callback(error,message)` 回调，error 表示错误，message 表示获取的数据

#### *isShareSecureKeyValid(callback)*`AL-[125,)`

描述：支持小米加密芯片的蓝牙设备，在被分享的设备中，调用此方法，可判断分享的电子钥匙是否过期

- `callback(error,message)` 回调，error 表示错误，message 表示获取的数据

  例子：

  ```javascript
  MHXiaomiBLE.isShareSecureKeyValid((error,message)=>{
  	if(!error){
  		//根据 message 中的 ’valid‘ 字段判断，1 -- 有效；0 -- 无效（已经过期）
  	}
  })
  ```

  ​
