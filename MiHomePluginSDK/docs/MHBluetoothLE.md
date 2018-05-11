# MiHomePlugin API参考文档
## MHBluetoothLE模块 `AL-[110,)`

扩展程序通过 MHBluetoothLE 模块与蓝牙设备交互。此模块中封装了普通蓝牙设备的连接、断开、发现服务、读写、监听广播等功能。使用方式类似于 iOS开发中的CoreBluetooth.framework。

**注意扩展程序需要正确处理蓝牙的连接与断开。用户退出插件时，必须断开连接。**

```js
// 模块初始化
var MHBluetoothLE = require('NativeModules').MHBluetoothLE;
```

**我们提供了一个蓝牙示例程序，见 com.xiaomi.corebledemo.ios  目录**

### 常量
#### *event*
`MHBluetoothLE`模块所有的消息类型 Object

* event.centralManagerDidUpdateState central mananger 状态发生改变（蓝牙关闭，打开等）
* event.centralManager_didDisconnectPeripheral_error 设备断开连接
* event.centralManager_didConnectPeripheral_error 设备连接成功
* event.centralManager_didFailToConnectPeripheral_error 设备连接失败
* event.centralManager_didDiscoverPeripheral_advertisementData_RSSI 发现设备
* event.peripheralDidUpdateName 设备名称改变
* event.peripheral_didModifyServices 设备服务修改
* event.peripheralDidUpdateRSSI_error 设备RSSI值更改(<=iOS8)
* event.peripheral_didReadRSSI_error 设备RSSI值读取和改变(>iOS8)
* event.peripheral_didDiscoverServices 发现设备支持的所有服务
* event.peripheral_didDiscoverIncludedServicesForService_error 发现某服务下的服务
* event.peripheral_didDiscoverCharacteristicsForService_error 发现某服务下的特征
* event.peripheral_didUpdateValueForCharacteristic_error 某服务特征内容发生改变(读取或者通知)
* event.peripheral_didWriteValueForCharacteristic_error 向某服务特征写入数据完成
* event.peripheral_didUpdateNotificationStateForCharacteristic_error 某通知类型服务特征改变通知状态
* event.peripheral_didDiscoverDescriptorsForCharacteristic_error 发现某服务特征描述
* event.peripheral_didUpdateValueForDescriptor_error 某服务特征描述内容发生改变(读取）
* event.peripheral_didWriteValueForDescriptor_error 向某服务特征描述写入数据完成

``` javascript 
var events = MHBluetoothLE.event;
```



#### *scanOption*
`MHBluetoothLE` 模块扫描设备的选项key 
类型: `Object`
* scanOption.allowDuplicatesKey 设置一个Boolean值表示扫描时是否需要重复过滤 
* scanOption.solicitedServiceUUIDsKey 指定此扫描选项将导致管理器也扫描寻求数组中包含的任何服务的外设。

#### *initOption*
`MHBluetoothLE` 模块初始化选项（目前暂时不支持）

#### *connectOption*
`MHBluetoothLE` 模块连接设备的选项key Object

* connectOption.notifiOnConnectKey 设置一个Boolean值表示在应用suspended后设备连接成功是否显示系统弹窗
* connectOption.notifyOnDisconnectionKey 设置一个Boolean值表示在应用suspended后设备断开连接是否显示系统弹窗
* connectOption.notifyOnNotificationKey 设置一个Boolean值表示在应用suspended后接收到设备通知是否显示系统弹窗



### MHBluetoothLE 的回调机制
苹果的 CoreBluetooth 框架中，调用 CBCentralManager 与 CBPeripheral 的方法，分别通过 CBCentralManagerDelegate 与 CBPeripheralDelegate 的回调方法返回结果。MHBluetoothLE 采用与此类似的方式，由插件注册监听事件通知来处理相应的回调。另外MHBluetoothLE支持回调绑定，可在调用接口时传递callback方法，MHBluetoothLE会根据本次调用来回调callback方法返回本次结果（回调绑定后仅调用一次）

**MHBluetooth 接收MHBluetooth模块扫描到的设备的事件。**

蓝牙事件的规则如下：

1. CBCentralManagerDelegate 以及 CBPeripheralDelegate 中的大部分回调方法（简称 *CB 回调* ）在 MHBluetoothLE 中都有对应的通知事件（简称 *M 事件* ）。
2. *M 事件* 与其对应的 *CB 回调* 的含义、功能以及调用时机完全相同。
3. 单参数的 *CB 回调*，*M 事件* 名称与 *CB 回调* 名相同（字母、大小写均相同）。如：
   *CB 回调* ：

   ```Objective-C
   - (void)centralManagerDidUpdateState:(CBCentralManager *)central
   ```

   对应的 *M 事件* 为：

   ```javascript
   MHBluetoothLE.event.centralManagerDidUpdateState
   ```

4. 多参数的 *CB 回调*，*M 事件*名称为每段*CB 回调*名以下划线"_"连接。如：
   *CB 回调* ：

   ```Objective-C
   - (void)centralManager:(CBCentralManager *)central didDisconnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error
   ```

   对应的 *M 事件* 为：

   ```javascript
   MHBluetoothLE.event.centralManager_didDisconnectPeripheral_error
   ```

5. *CB 回调* 的参数，会通过 *M 事件* 携带在通知中广播给插件，但 centralManager 和 peripheral 参数会被过滤掉。

### 可以在插件端监听的事件

```javascript
// 监听事件示例代码
var {DeviceEventEmitter} = require('react-native');
var subscription = DeviceEventEmitter.addListener(MHBluetoothLE.event.peripheral_didDiscoverServices,(notification) => {
  console.log(JSON.stringify(notification));
  var error = notification[0];
  if(error) {
  	MHPluginSDK.showFialedTips(error.message);
  	return;
  }
  var peripheral = notification[1];
  var services = notification[2];
});
```

**注意:**  与其他普通事件一样，监听的事件通知，需要在 componentWillUnmount 方法中取消监听。

```javascript
// 取消监听事件示例代码
componentWillUnmount() {
  if (subscription)
  {
    subscription.remove();
  }  
}
```

具体可以参见 SDK 中附带的蓝牙示例插件 *com.xiaomi.corebledemo.ios*


### 资源 URI
无

### 错误 Error

大部分接口回调的第一个参数常为一个错误对象，该对象格式如下：

```javascript
{
  code:1, //表示发生错误的层级 1表示设备错误，2表示服务错误，3表示特征错误，4表示描述错误，5表示其他错误
  message:'xx,xx', //错误的描述信息
  peripheral:'FFF0',//发生错误的设备identifier
  service:'FFF1', //发生错误的服务UUID
  characteristic:'FFF2', //发生错误的特征UUID
  domain:'characteristic' //发生错误的域，参加code
}
```



### API
MHBluetoothLE 的API导出了大部分`CBCentralManager`和`CBPeripheral`的方法。有OC开发经验的可参看`CoreBluetooth.framework`的文档

#### *strartScan(services, options, callback(error))*
描述：扫描周围的蓝牙设备

参数：

* `service` 你想要扫描到包含次服务的设备 *Array(String)*;
* `options` 设置的扫描选项
* `callback` 扫描错误回调，当调取扫描失败的时候会调用此回调


例子：

```javascript

MHPluginSDK.showLoadingTips('开始扫描附近的小米蓝牙开发板');
var options = {};
options[MHBluetoothLE.scanOption.allowDuplicatesKey] = true,
options[MHBluetoothLE.scanOption.solicitedServiceUUIDsKey] = [serviceUUID];
MHBluetoothLE.startScan([ServiceUUID], options, (error) => {
  MHPluginSDK.dismissTips();
  if(error){
    MHPluginSDk.showFailedTips(error.message);
  }
});
 
```

#### *stopScan(callback(error))*

描述：停止设备扫描

参数：

* `callback` 停止失败时回调用此方法

例子：

```javascript
MHBluetoothLE.stopScan(() => {});	
```



#### *isEnabled(callback(isEnable))*

描述： 蓝牙是否可用

参数：

* `callback(isEnable)` 同过callback来返回结果，callback参数为boolean值，ture表示可用，false表示不可用

例子：

```javascript
MHBluetoothLE.isEnabled((isEnable) => {
  if(isEnable){
    //do your work
  }
});
```



#### *retrievePeripheralsWithIdentifiers(identifiers, callback(peripherals))*

描述：检索所有包含identifiers中指定UUID的设备

参数：

* `identifiers`  需要检索的设备的UUID Array(String)

* `callback(devices)` 结果返回回调 返回检索到的所有设备 并与devices方式返回

  ```javascript
  {'some_peripheral_identifier_A':{
     identifier: 'xxxxx',
     services: [],
     name: 'xxx',
     state: 'connected',
     rssi: -50
  },
   'some_peripheral_identifier_B':{
     identifier: 'xxxxx',
     services: [],
     name: 'xxx',
     state: 'connected',
     rssi: -50
  },
  }
  ```

#### *retrieveConnectedPeripheralsWithServices(identifiersk,callback(peripherals))*

描述：检索所有包含identifiers中指定UUID的已连接的设备

参数：

- `identifiers`  需要检索的设备的UUID Array(String)

- `callback(error, devices)` 结果返回回调 返回检索到的所有设备 并与devices方式返回 格式如下：

  ```javascript
  {'some_peripheral_identifier_A':{
     identifier: 'xxxxx',
     services: [],
     name: 'xxx',
     state: 'connected',
     rssi: -50
  },
   'some_peripheral_identifier_B':{
     identifier: 'xxxxx',
     services: [],
     name: 'xxx',
     state: 'connected',
     rssi: -50
  },
  }
  ```

#### *getDefaultDevice(callback)*

描述：获取控制页默认设备信息（可能没有默认设备）

参数：

* `callback(error, device)` 结果返回回调 结果device如下格式：

  ```javascript
  {
    model:'', //设备的model
    did: '', //设备的device id
    name: '', //设备的名称
    token: '', //设备的token
    broadcastNotificationName: '', // 设备的广播名称
    extra: {}, // 设备的额外信息
    peripheral: {}, // 设备蓝牙信息
   }
  ```



#### *connectDevice(did, callback)*

描述：通过did连接原生页传递到插件页的设备（能够连接的设备是通过getDeviceList()方法返回的设备）

参数:

* `did` 设备的device id
* `callback(error peripheral)` 结果回调

例子：

```javascript
MHBluetoothLE.connectDevice(did, (error, peripheral) => {
  
});
```



#### *getDeviceList(callback)*

描述：获取原生蓝牙扫描页面传递到本地插件页面的设备列表

参数：

* `callback(error, devices)` 结果回调

  ​

#### *connect(identifier, options, callback)*

描述: 连接插件扫描到的设备

参数： 

* `identifier` 设备的identitier
* `options` 连接配置选项  设置key 参见 常量`connectOption`
* `callback(error, peripheral)` 结果回调

例子：

```javas
MHPluginSDK.showLoadingTips('设备连接中..');
MHBluetoothLE.connect(peripheral.identifier, {}, (error, result) => {
  MHPluginSDK.dismissTips();
  if (error) {
    MHPluginSDK.showFailTips('设备连接失败');
    return;
  }

  this._connectSuccess(result);
});
```



#### *disconnect(identifier, callback)*

描述： 断开设备连接

参数：

* `identifier` 设备的identifier
* `callback(error, peripheral)` 结果回调

例子：

```javascript
MHBluetoothLE.disconnect(this.props.peripheral.identifier, () => {});
```



#### *list(callback)*

描述：扫描到的所有设备列表

参数：

* `callback(error, peripherals)` 结果回调 peripherals 为蓝牙设备数组



#### *isConnected(identifier, callback)*

描述： 设备是否已经连接

参数：

* `identifier` 需要查询的蓝牙设备identifier
* `callback(error, isConnected)` 结果回调 isConnected为true时表示已连接，false是断开连接



#### *readRSSI*(identifier, callback)

描述：读取设备的RSSI

参数：

* `identifier` 需要查询的蓝牙设备identifier
* `callback(error, peripheral, rssi)` error表示是否有错误 peripheral是查询的蓝牙设备信息，rssi是该蓝牙设备的信号强度

例子：

```javascript
MHBluetoothLE.readRSSI(peripheral.identifier, (error, peripheral, rssi) => {
   //alert(JSON.stringify(peripheral));
 });
```



#### *readName(identifier, callback)*

描述：读取设备的名称

参数：

- `identifier` 需要查询的蓝牙设备identifier
- `callback(error, name)` error表示是否有错误， name是该蓝牙设备的名称



#### *infoForPeripheral(identifier, callback)*

描述：读取设备的详细信息

参数：

- `identifier` 需要查询的蓝牙设备identifier

- `callback(error, peripheral)` error表示是否有错误， peripheral是该蓝牙设备的详细信息，格式如下：

  ```javascript
  {
    identifier: 'FFF0', //蓝牙设备的identifier
    name: '小米蓝牙开发板', //蓝牙设备名称
    rssi: -50, //蓝牙设备的RSSI强度
    state: 'connected', //蓝牙设备的连接状态(disconnected, connecting, connected, disconnecting, unknown)
    services: {}, //蓝牙设备支持的服务 以服务的uuid作为key，服务信息详情作为value
  }
  ```

##### 连接状态

* connected 已连接
* connecting 正在连接
* disconnected 已断开
* disconnecting 正在断开连接
* unknown 未知

#### *infoForService(serviceUUID, identifier, callback)*

描述：读取某设备的某项服务的详细信息

参数：

* `serviceUUID` 所查询的服务的UUID

* `identifier` 需要查询的蓝牙设备identifier

* `callback(error, service)`  error表示是否有错误， service是该蓝牙设备某服务的详细信息，格式如下：

  ```javascript
  {
    peripheral: 'FFF0', //该服务所属蓝牙设备的identifier
    uuid: 'FFEF', //服务的UUID
    isPrimary: true, //服务是否是主服务
    includeServices: {}, //服务支持的包含服务 以服务的uuid作为key，服务信息详情作为value
    characteristics: {}, //服务支持的特征 以特征的uuid作为key，特征信息详情作为value
  }
  ```

  ​

#### *infoForCharacteristic(characteristicUUID, serviceUUID, identifier, callback)*

描述： 读取某设备某项服务的某特征的详细信息

参数：

* `characteristicUUID` 查询的特征的UUID

- `serviceUUID` 查询的特征所属服务的UUID

- `identifier` 需要查询的蓝牙设备identifier

- `callback(error, characteristic)`  error表示是否有错误， characteristic是该蓝牙设备某服务的某特征的详细信息，格式如下：

  ```javascript
  {
    peripheral: 'FFF0', //该特征所属服务服务所属蓝牙设备的identifier
    service： 'FFF1'， //该特征所属服务的UUID
    uuid: 'FFEF', //特征的UUID
    isNotifying: true, //特征是否是开启通知
    isBroadcasted: true, //特征是否是开启广播
    properties: 'broadcast', //特征类型
    descriptors: {}, //服务支持的描述 以描述的uuid作为key，描述信息详情作为value
  }
  ```

##### 特征类型

* bradcast 广播数据
* read 读数据
* writeWithoutResponse 无响应写数据
* write 有响应写数据
* notify 通知
* indicate 表现
* authenticatedSignedWrites 
* extendedProperties
* notifyEncryptionRequired
* indicateEncryptionRequired
* unknown



#### infoForDescriptor(descriptorUUID, characteristicUUID, serviceUUID, identifier, callback)*

描述： 读取某设备某项服务的某特征的某描述的详细信息

参数：

* `descriptorUUID` 查询的描述的UUID

- `characteristicUUID` 查询的描述所属特征的UUID


- `serviceUUID` 查询的特征所属服务的UUID

- `identifier` 需要查询的蓝牙设备identifier

- `callback(error, descriptor)`  error表示是否有错误， descriptor是该蓝牙设备某服务的某特征的某描述的详细信息，格式如下：

  ```javascript
  {
    peripheral: 'FFF0', //该服务所属蓝牙设备的identifier
    service: 'FFF1', //该描述所属服务的uuid
    characteristic: 'FFF2',//该描述所诉特征的UUID
    uuid: 'FFEF', //服务的UUID
    value: Object/String, //描述的其他信息
  }
  ```



#### *discoverServices(identifier, services)*

描述：发现当前设备peripheral的services，

参数：

* `identifier`  需要查询的蓝牙设备identifier
* `services` 需要发现的service的UUID数组 当services=[]时表示查询此设备支持的所有服务
* `callback(error, peripheral, services)`  error表示是否有错误，peripheral表示设备的信息，services表发现到的服务

例子：

```javascript
//搜索设备的服务
MHBluetoothLE.discoverServices(this.state.device.peripheral.identifier, [UUID_SERVICE], (error, peripheral, services) => {
  if (!error && services[UUID_SERVICE]) {
    this._initCharacteristicStatus(services[UUID_SERVICE]);
  }else {
    MHPluginSDK.showFailTips('未能找到匹配的操作:'+error.message);
  }
});
```



#### *discoverIncludeServices(identifier, serviceUUID, services, callback)*

描述：发现当前设备peripheral的某service种的includeServices，

参数：

- `identifier`  需要查询的蓝牙设备identifier
- `serviceUUID` 需要查询的service的UUID
- `services` 需要发现的service的UUID数组 当services=[]时表示查询此设备支持的所有服务
- `callback(error, service, includeServices)`  error表示是否有错误，service表示设备的服务信息，includeServices表示发现到的服务

例子：

```javascript
//搜索设备的服务
MHBluetoothLE.discoverIncludeServices(this.state.device.peripheral.identifier, service [UUID_SERVICE], (error, peripheral, inscludeServices) => {
  if (!error && inscludeServices[UUID_SERVICE]) {
    this._initCharacteristicStatus(inscludeServices[UUID_SERVICE]);
  }else {
    MHPluginSDK.showFailTips('未能找到匹配的操作:'+error.message);
  }
});
```



#### *discoverCharacteristics(identifier, serviceUUID, charas, callback)*

描述：发现当前设备的某服务的特征

参数：

- `identifier`  需要查询的蓝牙设备identifier
- `serviceUUID` 需要查询的service的UUID
- `charas` 期望发现的characteristic的UUID数组
- `callback(error, service, characteristics)`  error表示是否有错误，service表示设备的服务信息，characteristics表示发现到的特征

例子：

```javascript
MHBluetoothLE.discoverCharacteristics(this.state.device.peripheral.identifier, serivceUUID, characteristicUUIDs, (error, serivce, characteristics) => {
  if (!error) {
    //通知是否被打开
    //do your task
  }
});
```



#### *discoverDescriptors(identifier, serviceUUID, characteristicUUID, callback)*

描述：发现当前设备的某服务的某特征的描述

参数：

- `identifier`  需要查询的蓝牙设备identifier
- `serviceUUID` 需要查询的service的UUID
- `characteristic` 需要查询的characteristic的UUID
- `callback(error, characteristic, descriptors)`  error表示是否有错误，characteristic表示特征信息，descriptors表示发现到的特征描述

例子：

```javascript
MHBluetoothLE.discoverDescriptors(characteristic.peripheral, characteristic.service, characteristic.uuid, (error, peri, descriptrors) => {
  if (error) {
    MHPluginSDK.showFailTips('查找失败');
  }else {
    MHPluginSDK.showFinishTips('搜索完成');
    this.setState({dataSource: this.state.dataSource.cloneWithRows(
      this._genRows(descriptrors)
    )});
  }
});
```



#### *readValue*(identifier, serviceUUID, characteristicUUID, callback)

描述：读取某设备的某服务的某特征值 

参数：

- `identifier`  需要查询的蓝牙设备identifier
- `serviceUUID` 需要查询的service的UUID
- `characteristic` 需要查询的characteristic的UUID
- `callback(error, characteristic, msgData)`  error表示是否有错误，characteristic表示特征信息，msgData 读取到的特征值，格式为16进制字符串 例如'807f9042'。

例子：

```javascript
MHBluetoothLE.readValue(service.peripheral, service.uuid, CharacteristicUUID_READ_NORDIC, (error, chara, msgData) => {
    if (error) {
      MHPluginSDK.showFilTips('获取数据失败');
      return;
    }
	//处理数据
    this._handleMsgForNineBot(msgData);
  });
```



#### *writeWithoutResponse(identifier, serviceUUID, characteristicUUID, msg, callback)*

描述：向某设备的某服务的某特征写入数据

参数：

- `identifier`  需要查询的蓝牙设备identifier
- `serviceUUID` 需要查询的service的UUID
- `characteristic` 需要查询的characteristic的UUID
- `msg` 发生到设备端的16进制字符串 例如：'FF00FF00'
- `callback(error)`  error表示是否有错误

例子：

```javascript
MHBluetoothLE.writeWithoutResponse(service.peripheral, service.uuid, CharacteristicUUID_READ_NORDIC, 'FF00FF00', (error) => {
    if (error) {
      MHPluginSDK.showFilTips('数据写入失败');
      return;
    }
  });
```



#### *writeValue(identifier, serviceUUID, characteristicUUID, msg, callback)* 

描述：向某设备的某服务的某特征写入数据

参数：

- `identifier`  需要查询的蓝牙设备identifier
- `serviceUUID` 需要查询的service的UUID
- `characteristic` 需要查询的characteristic的UUID
- `msg` 发生到设备端的16进制字符串 例如：'FF00FF00'
- `callback(error, characteristic)`  error表示是否有错误  characteristic写入成功的特征

例子：

```javascript
MHBluetoothLE.writeWithoutResponse(service.peripheral, service.uuid, CharacteristicUUID_READ_NORDIC, 'FF00FF00', (error, characteristc) => {
    if (error) {
      MHPluginSDK.showFilTips('数据写入失败');
      return;
    }
  });
```



#### *enableNotify(identifier, serviceUUID, characteristicUUID, callback)*

描述：打开某特征的通知功能

参数：

- `identifier`  需要查询的蓝牙设备identifier
- `serviceUUID` 需要查询的service的UUID
- `characteristic` 需要打开通知的characteristic的UUID
- `callback(error, characteristic, isNotifying)`  error表示是否有错误  characteristic写入成功的特征

例子：

```javascript
MHBluetoothLE.enableNotify(characteristic.peripheral, characteristic.service, characteristic.uuid, (error, characteristic, isNotifying) => {
  if(error){
    MHPluginSDK.showFailTips('打开失败');
    this._notifySwitch.setSwichByProps(!isOn);
  }
  this.state.isNotifying = isOn;
});
```



#### disableNotify(identifier, serviceUUID, characteristicUUID, callback)*

描述：关闭某特征的通知功能

参数：

- `identifier`  需要查询的蓝牙设备identifier
- `serviceUUID` 需要查询的service的UUID
- `characteristic` 需要打开通知的characteristic的UUID
- `callback(error, characteristic, isNotifying)`  error表示是否有错误  characteristic写入成功的特征

例子：

```javascript
MHBluetoothLE.disableNotify(characteristic.peripheral, characteristic.service, characteristic.uuid, (error, characteristic, isNotifying) => {
  if(error){
    MHPluginSDK.showFailTips('关闭失败');
    this._notifySwitch.setSwichByProps(!isOn);
  }
  this.state.isNotifying = isOn;
});
```



#### *readDescriptorValue(identifier, serviceUUID, characteristicUUID, descriptorUUID, callback)*

描述：读取某设备的某服务的某特征值 

参数：

- `identifier`  需要查询的蓝牙设备identifier
- `serviceUUID` 需要查询的service的UUID
- `characteristic` 需要查询的characteristic的UUID
- `descriptorUUID` 读取数据的descriptor的UUID
- `callback(error, descriptor, msgData)`  error表示是否有错误，descriptor表示描述的信息，msgData 读取到的描述值(类型不确定)。

例子：

```javascript
MHBluetoothLE.readDescriptorValue(descriptor.peripheral, descriptor.service, descriptor.characteristic, descriptor.uuid, (error, result, body) => {
 if (!error) {
   alert(JSON.stringify(body));
 }else {
    alert('error:'+error.message+JSON.stringify(result));
 }
});
```



#### writeDescriptorValue(identifier, serviceUUID, characteristicUUID, descriptorUUID, body, callback)*

描述：读取某设备的某服务的某特征值 

参数：

- `identifier`  需要查询的蓝牙设备identifier
- `serviceUUID` 需要查询的service的UUID
- `characteristic` 需要查询的characteristic的UUID
- `descriptorUUID` 读取数据的descriptor的UUID
- `body` 写入到描述的数据(常用类型)
- `callback(error, descriptor, msgData)`  error表示是否有错误，descriptor表示描述的信息

例子：

```javascript
MHBluetoothLE.writeDescriptorValue(descriptor.peripheral, descriptor.service, descriptor.characteristic, descriptor.uuid, '9f085a', (error, result) => {
 if (error) {
   alert(JSON.stringify(error));
 }
});
```



### 其他

#### *callback和event*

API中大部分接口的最后一个参数是callback，此callback来回传本次操作的结果，此callback仅对本次操作有效，所以对于有些设备分多次返回数据的情况则callback方式并不适用，建议使用监听消息方式来获取多次获取操作结果。例如`readValue()`,有些设备的数据过大，根据CoreBluetooth.framework文档，设备可能会分多次调用peripheral:didUpdateValueForCharacteristic:error代理, MHBluetoothLE模块的callback仅能获取第一次代理调用返回的数据，但是如果监听MHBluetoothLE.event.peripheral_didUpdateValueForCharacteristic_error事件就可以分多次获取全部数据。

callback回调的参数一般是(error，forWho， result)三参数形式返回，error表示是否有错误，forWho表示操作的是哪个层级的对象(peripheral, service, characteristic,descriptor)，result是方法调用的结果

event消息返回一个数组对象的参数，数组内容格式：[error, forWho, result]，error表示是否有错误，forWho表示操作的是哪个层级的对象(peripheral, service, characteristic,descriptor)，result是方法调用的结果

#### *读/写数据*

MHBluetoothLE模块中JavaScript to Objective-c的数据的传递都是以16进制字符串的方式进行的，例如向设备端写入一个字符串`'1111'`,那么需要把字符串`'1111'` 转换成16进制字符串`'30303030'`；设备端向外发生数据时也会被MHBluetoothLE模块转换成16进制字符串的形式，例如设备端发送数据是数字`123`, 那么MHBluetoothLE就会转换为`'7B'`。

在com.xiaomi.corebledemo.ios/Main/XiaoMiBLEMainPage.js示例中提供了两个方法：

* _hexStrToByteArr(hexStr); //16进制字符串转换为10进制数数组
* _byteArrToHexStr(byteArr); //10进制数组转换为16进制字符串(10进制数接受范围是0~255, 包含0和255)



#### *方法的超时*

MHBluetoothLE模块是基于CoreBluetooth.framework框架开发，CoreBluetooth.framework部分接口存在调用后无响应（也就是超时），所以使用MHBluetoothLE时需要自己控制接口调用的超时处理，比如扫描设备，当没有扫描到设备事MHBluetoothLE并不会调用回调，也没有事件进行通知，所以需要调用者自行处理，例如如下代码：

```javascript
MHPluginSDK.showLoadingTips('开始扫描附近的小米蓝牙开发板');
MHBluetoothLE.startScan([ServiceUUID], {}, (error) => {
  MHPluginSDK.dismissTips();
});

//设置20秒的超时处理
setTimeout(() => {
  if (this._isEmptyObject(discoverPeripherals)) {
    MHPluginSDK.showFailTips('未发现附近的小米蓝牙开发板');
    MHBluetoothLE.stopScan(() => {});
    this.props.navigator.pop();
  }else {
    MHPluginSDK.dismissTips();
  }
}, 20000);
```



#### *config.plist*

我们在`config.plist`配置项中新增了一个key：`bleScanIsNeedDelegate` 来配置自定义蓝牙设备插件快联是否需要被代理扫描蓝牙设备，如果配置true则表示需要，如果配置false则表示不需要代理扫描，此时需要插件快联页自己实现蓝牙设备扫描的逻辑。配置示例如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>pluginStructureVersion</key>
	<integer>1</integer>
	<key>deviceStatusRefreshInterval</key>
	<integer>6</integer>
	<key>bleScanIsNeedDelegate</key>
	<true/>
</dict>
</plist>

```



> **更多代码示例请看com.xiaomi.corebledemo.ios**

