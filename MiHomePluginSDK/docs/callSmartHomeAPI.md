### callSmartHomeAPI(api, params, callback)



##### 常用接口

- `/scene/list` 获取设备定时列表


- `/scene/delete` 删除设备定时


- `/scene/edit` 创建（编辑）设备定时


- `/home/latest_version`  {"model": model} 获取最新固件版本（蓝牙设备）


- `/home/checkversion`  {"pid":0, "did":did} 获取最新固件版本（WiFi设备）

  ​

##### 设备数据上报、获取 

扩展程序获取设备上报给米家云端的 属性 与 事件 接口（包含蓝牙设备通过蓝牙网关上报的数据）：

- `/user/get_user_device_data`  读取与时间相关数据，请求参数示例：

```javascript
    {
      "did":"123",   //设备 id
      "uid":'123',   //要查询的用户 uid 
      "key":"power", //与上报时一致
      "type":"prop", //与上报时一致，属性 为 prop ，事件为 event
      "time_start":"1473841870", //数据起点时间，单位为秒
      "time_end":"1473841880", //数据终点时间，单位为为秒
      "group": //返回数据的方式，默认 raw , 可选值为 hour、day、week、 month。
      "limit": //返回数据的条数，默认 20，最大 1000
    }
```

- `/device/batchdevicedatas` 读取与时间无关数据，请求参数示例：

```javascript
{
  "0":{
    "did":"311223", //设备 id
    "props":["prop.usb_on","prop.on"]
  },
   "1":{
     "did":"311304",
     "props":["prop.usb_on","prop.on"]
  }
}
```

- `/user/set_user_device_data`   扩展程序上报设备数据（属性与事件）至米家云端，支持批量，请求参数示例：

```javascript
{
  "0": {
    "uid": "xxx", //用户 uid
    "did": "123", //设备id
    "time": "1473841870", //时间戳，单位为秒
    "type": "prop", // 属性为 prop，事件为 event
    "key": "power",
    "value": {} 
  },
  "1": {
    "uid": "xxx",
    "did": "456",
    "time": "1473841888",
    "type": "prop",
    "key": "power",
    "value": {}
  }
}
```

*注：米家服务器不解析该 `value` 故可按照自身需要定义内部格式，只要保证 `value` 最终是 `string` 即可。*	



##### 设备数据存储

扩展程序存取跟设备相关数据，设备解绑（被用户删除）时，数据会立即被服务器自动清理

- `/device/getsetting` 获取数据，参数示例：

  ```json
  {
  "did":xxx,
  "settings":["keyid_xxx_data"]
  }
  ```

- `/device/setsetting` 设置数据，参数示例：

  ```json
  {
   "did":xxx,
   "settings":{
      "keyid_xxx_data": "value1"
   }
  }
  ```



##### FDS

小⽶提供文件存储云服务 ( File Storage Service，简称 FDS )，厂商有文件存储管理需求时可使用。

MIOT 设备使用 FDS 请参考指南：[MIOT FDS功能指南-微服务.pdf](./MIOT%20FDS功能指南-微服务.pdf)

扩展程序端接口参考指南中 **app侧接口** 章节。注意 *callSmartHomeAPI* 方法会自动帮你填充 `/app` 前缀。如：

接口：`/app/home/genpresignedurl` 调用为：

```javascript
MHPluginSDK.callSmartHomeAPI('/home/genpresignedurl', params, (response) => {}});
```



##### 示例

```javascript

// 获取当前设备固件版本
//MHPluginSDK.getDevicePropertyFromMemCache(["version"], (props) => {
// console.log("current version"+props.version);
//});

// 获取最新固件版本（蓝牙设备）
MHPluginSDK.callSmartHomeAPI("/home/latest_version", {"model":MHPluginSDK.deviceModel}, (response) => {
  console.log("latest version"+JSON.stringify(response));
});

// 获取最新固件版本（WIFI设备）
// pid 固定为0
MHPluginSDK.callSmartHomeAPI("/home/checkversion", {"pid":0, "did":MHPluginSDK.deviceId}, (response) => {
  console.log("latest version"+JSON.stringify(response));
});

// 删除已经设置的定时
MHPluginSDK.callSmartHomeAPI('/scene/delete', delDate, (response) => {
  AlertIOS.alert(JSON.stringify(response));
});

// 获取设备上报数据
MHPluginSDK.callSmartHomeAPI('/user/get_user_device_data',{"did":MHPluginSDK.deviceId,"uid":MHPluginSDK.ownerId,"key":"power","type":"prop","time_start":"1473841870","time_end":"1473841880"}, (response) => {
  AlertIOS.alert(JSON.stringify(response));
});

//获取某设备存储在 fds 的文件下载地址
MHPluginSDK.callSmartHomeAPI('/home/getfileurl', {"did":MHPluginSDK.deviceId, "time":1345555512}, (response) => {
  //use Fetch to download the file
}});
```

