# MiHomePlugin API参考文档
## MHBluetooth模块 `AL-[100,)`

扩展程序通过 MHBluetooth 模块与支持小米蓝牙协议的设备交互。此模块中封装了与米家对接的蓝牙设备连接、断开、发现服务、读写、监听广播等功能。使用方式类似于 CoreBluetooth。

如果该模块中的 API 不能全部满足业务需求，可使用 `MHBluetoothLE` 加 `MHXiaomiBLE` 模块来实现。

**注意扩展程序需要正确处理蓝牙的连接与断开。用户退出插件时，必须断开连接。**

```js
// 模块初始化
var MHBluetooth = require('NativeModules').MHBluetooth;
```

**我们提供了一个蓝牙示例插件，见 com.xiaomi.bledemo.ios  目录**

### 常量
无

### MHBluetooth 的回调机制
苹果的 CoreBluetooth 框架中，调用 CBCentralManager 与 CBPeripheral 的方法，分别通过 CBCentralManagerDelegate 与 CBPeripheralDelegate 的回调方法返回结果。MHBluetooth 采用与此类似的方式，由插件注册监听事件通知来处理相应的回调。

**MHBluetooth 只会接收当前插件控制的设备的事件。**

蓝牙事件的规则如下：

1. CBCentralManagerDelegate 以及 CBPeripheralDelegate 中的大部分回调方法（简称 *CB 回调* ）在 MHBluetooth 中都有对应的通知事件（简称 *M 事件* ）。**目前有部分不常用的方法没有对应的通知事件**
2. *M 事件* 与其对应的 *CB 回调* 的含义、功能以及调用时机完全相同。
3. 单参数的 *CB 回调*，*M 事件* 名称与 *CB 回调* 名相同（字母、大小写均相同）。如：
   *CB 回调* ：

   ```oc
   - (void)centralManagerDidUpdateState:(CBCentralManager *)central
   ```

   对应的 *M 事件* 为：

   ```js
   MHBluetooth.centralManagerDidUpdateState
   ```

4. 多参数的 *CB 回调*，*M 事件*名称为每段*CB 回调*名以下划线"_"连接。如：
   *CB 回调* ：

   ```oc
   - (void)centralManager:(CBCentralManager *)central didDisconnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error
   ```

   对应的 *M 事件* 为：

   ```js
   MHBluetooth.centralManager_didDisconnectPeripheral_error
   ```

5. *CB 回调* 的参数，会通过 *M 事件* 携带在通知中广播给插件，但 centralManager 和 peripheral 参数会被过滤掉。

### 可以在插件端监听的事件

```js
// 监听事件示例代码
var {DeviceEventEmitter} = require('react-native');
var subscription = DeviceEventEmitter.addListener(MHBluetooth.peripheral_didDiscoverServices,(notification) => {
  console.log(JSON.stringify(notification));
  MHBluetooth.serviceUUIDsWithCallback((uuids) => {
    console.log(uuids);
  });
});
```

**注意** 与其他普通事件一样，监听的事件通知，需要在 componentWillUnmount 方法中取消监听。

```js
// 取消监听事件示例代码
componentWillUnmount() {
  if (subscription)
  {
    subscription.remove();
  }  
}
```

具体可以参见 SDK 中附带的蓝牙示例插件 *com.xiaomi.bledemo.ios*

#### *centralManagerDidUpdateState*
>蓝牙开关状态改变

#### *centralManager_didConnectPeripheral*
>设备已连接

#### *centralManager_didFailToConnectPeripheral_error*
>设备连接失败

#### *centralManager_didDisconnectPeripheral_error*
>设备断开连接

#### *peripheral_didDiscoverServices*
>设备服务发现完毕

#### *peripheral_didDiscoverCharacteristicsForService_error*
>服务的特征发现完毕

#### *peripheral_didUpdateValueForCharacteristic_error*
>服务特征值发生更新（被 read 之后，或收到设备 notify 通知）

#### *peripheral_didWriteValueForCharacteristic_error*
>服务特征值写入完毕

#### *peripheral_didUpdateNotificationStateForCharacteristic_error*
>服务特征值 notify 状态发生改变

#### *peripheral_didReadRSSI_error*
>读到新的 RSSI

#### *peripheralDidUpdateRSSI_error*
>RSSI 更新

### 资源 URI
无

### API
#### *discoverServices()*
>发现当前设备peripheral的services。
>
```js
var {DeviceEventEmitter} = require('react-native');
var subscription = DeviceEventEmitter.addListener(MHBluetooth.peripheral_didDiscoverServices,(notification) => {
  console.log(JSON.stringify(notification));
  MHBluetooth.serviceUUIDsWithCallback((uuids) => {
    console.log(uuids);
  });
});
MHBluetooth.discoverServices();
```

#### *discoverCharacteristicsOfServiceUUID(serviceUUID)*
>发现当前设备peripheral的指定service的characteristics
>
>`serviceUUID` 服务的 UUID 字符串

#### *readBase64DataWithCallback(characteristicUUID, serviceUUID, callback)*
>读取当前设备peripheral的指定characteristic的值（base64编码）
>
>`characteristicUUID` 指定characteristic的UUID字符串
>`serviceUUID` 指定service的UUID字符串
>`callback` 回调方法 **(bool isSuccess, [characteristicUUID, serviceUUID])**
>
>**注意** 该方法的 callback 并不能返回数据，只是返回读取是否成功，数据的返回与 CoreBluetooth 一样，会通过对应的回调方法。
>
>```js
>var {DeviceEventEmitter} = require('react-native');
>// 订阅特征值更新通知
>var subscription = DeviceEventEmitter.addListener(MHBluetooth.peripheral_didUpdateValueForCharacteristic_error,(notification) => {
>  console.log(JSON.stringify(notification));
>});
>// 读取特征值
>MHBluetooth.readBase64DataWithCallback("0001", "fe95", (isSuccess, loopbackParams) => {
>  //
>});
>```

#### *writeBase64DataWithCallback(data, characteristicUUID, serviceUUID, type, callback)*
>向当前设备peripheral的指定characteristic写入值（base64编码）
>
>`data` 写入的数据，用base64编码，写入时会自动解码
>`characteristicUUID` 指定characteristic的UUID字符串
>`serviceUUID` 指定service的UUID字符串
>`type` 写入方式（0=需要response, 1=不需要response）
>`callback` 回调方法 **(bool isSuccess, [data, characteristicUUID, serviceUUID, type])**
>
>**注意** 该方法的 callback 并不能返回设备侧是否写入成功，只是返回APP侧写入命令执行是否成功，与 CoreBluetooth 一样，会通过对应的回调方法返回写入成功（ type=0 的情况下）。

#### *writeHexDataWithCallback(hexString, characteristicUUID, serviceUUID, type, callback)*   `AL-[113,)`
>向当前设备peripheral的指定characteristic写入值（16进制字符串格式）
>
>`data` 写入的数据，用16进制字符串格式，写入时会自动解码
>`characteristicUUID` 指定characteristic的UUID字符串
>`serviceUUID` 指定service的UUID字符串
>`type` 写入方式（0=需要response, 1=不需要response）
>`callback` 回调方法 **(bool isSuccess, [data, characteristicUUID, serviceUUID, type])**
>
>**注意** 该方法的 callback 并不能返回设备侧是否写入成功，只是返回APP侧写入命令执行是否成功，与 CoreBluetooth 一样，会通过对应的回调方法返回写入成功（ type=0 的情况下）。


#### *setNotifyWithCallback(needNotify, characteristicUUID, serviceUUID, callback)*
>设置当前设备peripheral的指定characteristic的通知状态
>
>`needNotify` 是否打开通知
>`characteristicUUID` 指定characteristic的UUID字符串
>`serviceUUID` 指定service的UUID字符串
>`callback` 回调方法 **(bool isSuccess, [needNotify, characteristicUUID, serviceUUID])**

#### *serviceUUIDsWithCallback(callback)*
>当前设备所有已发现的service的UUIDs
>
>`callback` 回调方法 **(Array serviceUUIDs)**

#### *characteristicUUIDsOfServiceUUIDWithCallback(serviceUUID, callback)*
>当前设备所有发现了的指定service的characteristic的UUIDs
>
>`serviceUUID` 指定service的UUID字符串
>`callback` 回调方法 **(Array characteristicUUIDs, [serviceUUIDs])**

#### *startListeningBroadcast()*
>开始监听当前设备的广播
>
>可通过监听MHBluetooth.receivedBroadcastEventName事件收到广播中的数据

#### *startListeningBroadcastWithoutDuplicatedPeripheral()*  `AL-[112,)`
>开始监听当前设备的广播(重复的peripheral只回调一次)
>
>可通过监听MHBluetooth.receivedBroadcastEventName事件收到广播中的数据


#### *stopListeningBroadcast()*
>停止监听当前设备的广播

#### *reconnectDeviceWithCallback(callback)*
>重新连接设备
>
>`callback` 回调方法 **(bool isSuccess)**

#### *disconnectDevice()*
>断开设备

#### *scanDeviceWithCallback(callback)*
>非小米协议的蓝牙设备扫描发现
>callback 回调方法**(error.code)** 200为成功发现，404为未发现，其他为错误码

#### *scanAndConnectForSeconds(double seconds, callback)*
>seconds 超时时间秒数
>callback 回调方法**(error.code)** 200为成功发现，404为未发现，其他为错误码，错误码为3时需要重新注册

#### *registerWithCallback(callback)*
>小米协议的蓝牙设备注册
>callback 回调方法**(error.code)** 200为成功发现，404为未发现，其他为错误码

#### *base64ManufactureDataWithCallback(callback)*
>获取自定义数据
>callback 回调方法**(base64ManufaxtureData)** 自定义数据的base64编码值

#### *setOfflineStatusDescription(desc)*
>设置设备列表离线状态（蓝牙未连接）副标题
>desc 字符串

#### *setOnlineStatusDescription(desc)*
>设置设备列表在线状态（蓝牙连接）副标题
>desc 字符串

#### *setStatusDescription(desc)*
>设置设备列表默认副标题
>desc 字符串

#### *getBluetoothStateCallback(callback)* `AL-[112,)`
>获取蓝牙状态
```javascript
MHBluetooth.getBluetoothStateCallback((state)=>{

	//CBManagerStateUnknown = 0,
	//CBManagerStateResetting,
	//CBManagerStateUnsupported,
	//CBManagerStateUnauthorized,
	//CBManagerStatePoweredOff,
	//CBManagerStatePoweredOn,
});
```

#### *getPeripheralInfo:(callback)* `AL-[116,)`
>获取蓝牙peripheral信息
```javascript
MHBluetooth.getPeripheralInfo((success,peripheral)=>{
	if(success){
      console.warn(peripheral);
	}
});
```
#### *readRSSI* `AL-[116,)`
>获取蓝牙peripheral rssi信息
>
>peripheral_didReadRSSI_error 通过此事件监听rssi值回调
>
>peripheralDidUpdateRSSI_error 通过此事件监听rssi error信息
```javascript
//添加监听
...

MHBluetooth.readRSSI();
```
