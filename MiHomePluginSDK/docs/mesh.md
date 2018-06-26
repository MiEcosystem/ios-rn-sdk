## BLE Mesh 设备扩展程序开发指南

#### 示例代码

我们提供了简单的示例扩展程序代码，请查看 [demo](../com.xiaomi.blemeshdemo.ios) 。

开发者可自行下载在开发者模式下运行。注意该扩展程序中 `packageInfo.json` 信息为小米 Mesh 开发板开发信息。



#### 数据交互

通常情况下，扩展程序需经由米家服务器、网关跟 Mesh 设备进行数据交互。如果需要直接建立蓝牙连接，请查看文档后续 蓝牙数据交互 部分。数据流简述为：

扩展程序   <====>   米家服务器   <====>  网关    <====>  Mesh 设备

Mesh 设备采用 `miot-spec` 接入，扩展程序作为控制端遵循该规范发送、接收数据。米家  iOS App 在 `MHPluginSDK` 基础模块中封装了 `callSpecMethod()` 方法，扩展程序直接填入参数调用即可。

获取设备属性：

```javascript
MHPluginSDK.callSpecMethod("get_properties", yourParams,(success,message) => {
    if (success) {
        //JSON.stringify(message)
    }
})
```

设置设备属性:

```javascript
MHPluginSDK.callSpecMethod("set_properties", yourParams,(success,message) => {
    if (success) {
        //JSON.stringify(message)
    }
})
```



#### 固件升级

Mesh 设备固件升级功能由米家 App 内建、维护，扩展程序只需调用接口即可。工作机制为若有新固件版本，蓝牙搜索连接当前扩展程序所属设备，通过蓝牙数据通道传输固件文件更新。

扩展程序调用 `MHBluetooth `  模块中 `openMeshDFU()` 方法使用固件升级功能。

```javascript
MHBluetooth.openMeshDFU();
```



#### 蓝牙数据交互

若扩展程序需与 Mesh 设备建立蓝牙连接，请仔细阅读使用 [MHBluetooth](./MHBluetooth.md) 模块。如：

```javascript
//连接
MHBluetooth.scanAndConnectForSeconds(seconds, callback);
//断开
MHBluetooth.disconnectDevice();
//写数据
MHBluetooth.writeHexDataWithCallback(hexString, characteristicUUID, serviceUUID, type, callback);
```