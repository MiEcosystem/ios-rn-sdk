# MiHomePlugin API参考文档
# 介绍

## MHPluginSDK模块 `AL-[100,)`

MHPluginSDK 模块主要提供插件与米家主APP、智能设备，以及米家云端交互的API。包括获取设备信息、设置设备属性、向设备发送指令、访问米家云端接口、访问特定UI资源等等。

```javascript
// 模块初始化
var MHPluginSDK = require('NativeModules').MHPluginSDK
```

### 常量

#### *userId*
>当前登录用户的小米id
>
>String
>
>var userId = MHPluginSDK.userId;
>

#### *userName*
>当前登录用户的昵称
>
>String

#### *avatarURL* `AL-[122,)`
>当前登录用户的头像 url
>
>String


#### *ownerId*
>设备拥有者小米id，被分享的设备为分享来源，自己的设备为当前userId
>
>String

#### *deviceId*
>设备 did
>
>String

#### *deviceModel*
>设备 Model
>
>String

#### *deviceExtra* `AL-[109,)`
>设备 额外信息
>
>Object

#### *pageName* `AL-[110,)`
> 页面 插件需要展示的页面
>
> String
> `main` 插件页的主页面
> `connect` 插件页的快联页
> `sence` 插件页的场景页
> `setting` 插件的设置页面
> 其它请按照`main`来处理


#### *apiLevel*
>当前米家 APP 的 API_Level
>
>Int

#### *basePath*
>插件的资源目录路径
>
>String
>
>```js
>// 插件引用图片资源的方式
><Image style={styles.iconDemo} source={{isStatic:!this.state.devMode, uri:this.state.basePath + "icon_demo.png"}} />
>```

#### *devMode*
>当前插件运行的模式
>
>BOOL
>
>`true` 插件运行在本地调试模式下（开发者选项打开）
>
>`false` 插件运行在正式环境下（发布以后普通用户从服务器上下载）

#### *extraInfo*
>插件初始化时带入的参数，通常由用户点击 push 唤醒时会带入 push 的参数。如果开发自定义场景，在进入对应场景页面时，也会在这里带入trigger和action的信息。
>
>Object

#### *systemInfo*
>手机的系统信息
>
>Object
>
>`.mobileModel` 手机型号
>`.sysName` 系统名称
>`.sysVersion` 系统版本

#### *isVoiceDevice*
>当前的设备是不是语音设备
>
>BOOL

#### *viewWillAppear* `AL-[115,)`
>从 Native 界面返回到插件
>
>在插件页面 **push** 打开一个 native 的 viewController，然后再 **pop** 回插件页面时，会触发一个 *viewWillAppear* 事件。
>
>可以通过监听此事件更新已加载过的视图，或进行相应的事件处理。
>

``` js
componentWillMount() {
    this._viewWillAppearListener = DeviceEventEmitter.addListener(MHPluginSDK.viewWillAppear, (event) => {
    // 参数: event; { eventName: 'viewWillAppear', animated: true / false }
    // Todo:
    });
}

componentWillUnmount() {
    this._viewWillAppearListener.remove();
}
```

#### *deviceCancelAuthorization*  `AL-[130,)`
> 用户撤销隐私授权时的回调
>

```javascript
componentWillMount() {
    this._deviceCancelAuthorization = DeviceEventEmitter.addListener(MHPluginSDK. deviceCancelAuthorization, (event) => {

    });
}
componentWillUnmount() {
    this._deviceCancelAuthorization.remove();
}

```

#### *uriNaviBackButtonImage*

>导航栏返回按钮
>
>```js
>var imgPath = MHPluginSDK.uriNaviBackButtonImage;
>```

#### *uriNaviMoreButtonImage*

>导航栏更多按钮
>
>```js
>var imgPath = MHPluginSDK.uriNaviMoreButtonImage;
>```

#### *deviceStatusUpdatedEventName*

> 插件通过监听 `deviceStatusUpdatedEventName` 订阅设备的状态更新，详见[订阅设备状态的更新](#user-content-订阅设备状态的更新)。

#### *onReceivingForegroundPushEventName*

> 插件通过监听 `onReceivingForegroundPushEventName` 接收APNS的推送，详见[订阅APNS推送](#user-content-订阅apns推送)。

### 方法

#### *sendEvent(eventName, body)*

>发送一个事件。
>
>`eventName` 事件名字符串
>`body` 事件传递的参数字典，值只能为字符串、数值等简单类型，不能传递对象。
>
>其它模块可通过 DeviceEventEmitter.addListener 方法来注册并响应 sendEvent 发送的事件。

#### *registerDeviceStatusProps(propArr)*

>注册获取设备状态时的 属性名 /  事件名集合
>
>`propArr` 属性名 / 事件名 数组，具体参见该设备的 profile
>
>```js
>  // 假设设备的 profile 中有 power/brightness/color 几个属性 和 isOn 事件
>
>  //若为订阅模式
>MHPluginSDK.registerDeviceStatusProps(["prop.power", "prop.brightness", "prop.color","event.isOn"]);
>
>  //如果是轮询方式
>MHPluginSDK.registerDeviceStatusProps(["power", "brightness", "color"]);
>
>  //注意订阅模式为设备状态发生改变时，收到通知。轮询为定时获取当时属性。
>
>  //插件通过监听 MHPluginSDK.deviceStatusUpdatedEventName 来处理回调。
>```


#### *callMethod(method, params, extrainfo, callback)*
>调用设备 RPC 指令接口
>
>`method` 方法命令字字符串
>`params` 方法参数数组
>`extraInfo` 附加信息字典
>`callback` 回调方法 **(BOOL isSuccess, Object response)**
>
>米家APP会根据当时设备的情况选择是通过云端下发指令给设备，还是直接通过局域网向设备发送指令。设备接收的指令集请查阅该设备的 profile
>**注意** 此接口只适用于 WIFI 设备，蓝牙设备的控制请参见 MHBluetooth 文档
>

```
// toggle 命令切换插座的开关状态，该命令没有参数
MHPluginSDK.callMethod('toggle',[],{}, (isSuccess, json) => {
  console.log("toggle result:"+isSuccess+json);
  if (isSuccess)
  {
    this.setState({
      currentState: this.state.currentState == 'on' ? 'off' : 'on',
    });
  }
});
```

#### *callMethodForceWay(method, params, extrainfo, way, callback)* `AL-[109,)`

>调用设备 RPC 指令接口，指定发送方式（云端、局域网）
>
>`method` 方法命令字字符串
>`params` 方法参数数组
>`extraInfo` 附加信息字典
>`way` 发送方式 **[0-app策略, 此时等同于callMethod, 1-强制局域网, 2-强制远程]**
>`callback` 回调方法 **(BOOL isSuccess, Object response)**
>
>**注意** 此接口只适用于 WIFI 设备，蓝牙设备的控制请参见 MHBluetooth 文档
>
>```js
>// toggle 命令切换插座的开关状态，该命令没有参数，强制走局域网RPC
>MHPluginSDK.callMethodForceWay('toggle',[],{},1, (isSuccess, json) => {
>  console.log("toggle result:"+isSuccess+json);
>  if (isSuccess)
>  {
>    this.setState({
>  		currentState: this.state.currentState == 'on' ? 'off' : 'on',
>	});
>   }
>});
>```


#### *localPingWithCallback(callback)* `AL-[109,)`
>检测设备是否在局域网内（ping通）
>
>`callback` 回调方法 **(BOOL isLocal)**
>
>**注意** 此接口只适用于 WIFI 设备，蓝牙设备的控制请参见 MHBluetooth 文档
>

#### *callSmartHomeAPI(api, params, callback)*
>调用米家后台 API，与米家服务器交互。
>
>`api` 后台提供的 API 接口命令字字符串
>`params` 参数字典或数组（视具体 API 而定）
>`callback` 回调方法 **(Object response)**
>
>不同设备开放的接口请参照与米家后台对接时提供的文档或说明，以后台给出的信息为准。米家客户端只封装透传网络请求，无法对接口调用结果解释，有问题请直接联系项目对接后台人员或 PM。
>
>**后台常用 API 整理见：[文档](./callSmartHomeAPI.md)**
>

#### *fetchUserInfo(uids,  callback)*`AL-[125,)`
> 获取小米账户的小米id、头像、昵称信息
>
> `uids` 数组，需要查询信息的小米id
> `callback` 回调方法 **(Bool isSuccess,Array response)**
>
> 该方法支持批量查询，传入的`uids`为数组，查询的结果按序返回。当`uids`个数为 1 时，支持传入用户小米id、绑定的电话号码或邮箱；当`uids`个数大于 1 时，只支持传入小米 id
>
> ```javascript
> MHPluginSDK.fetchUserInfo([uid_A,uid_B,uid_C,uid_D],(isSuccess,response)=>{
>   if(!isSuccess){
> 	//so bad. what can i do ?
>     return;
>   }
>   //console.log(JSON.stringify(response));
> });
> ```

#### *updateDeviceInfoCallback(callback)* `AL-[107,)`
>向云端请求一次当前设备的信息，其中包含了当前设备是否在线
>
>`callback` 回调方法 **(Object response)**
>
>可以用这个请求来查询设备是否在线，但是请求间隔不能小于20s，否则可能会被米家服务器打击；**设备在线状态建议采用客户端计时，状态轮询几次无结果时认为设备已离线，一般无须用这个请求实现。**

#### *getDevicePropertyFromMemCache(keys, callback)*
>从内存缓存中获取设备属性当前值（不会发送网络请求）
>
>`keys` 属性名数组
>`callback` 回调方法 **(Object kvPairs)**
>
>**注意** 此方法并不会发送 RPC 指令给设备来获取最新状态，只是返回当前 APP 内存缓存中存储的对应属性值，可获取/设置的设备属性并不需要在设备的 profile 中，可以是任何合法的 key，实际上可以看作一片 key-value pair 形式存储的内存缓存，在退出插件时会被清空。
>
>可以用此方法获取一些设备属性，包括：
>

```
NSString* mac;            //设备的mac地址                 
NSString* version;        //设备当前固件版本
double longitude;         //上次绑定时的经度
double latitude;          //上次绑定时的纬度
NSString* name;           //设备名称，用户可以修改
NSString* model;          //设备类别标识，如插座、摄像头
NSString* parent_id;      //父设备的ID
NSString* parent_model;   //父设备的Model
BOOL isOnline;            //设备是否在线（是否通电）
BOOL adminFlag;           //是否被绑定
BOOL shareFlag;           //是否已分享
```

>想要发送 RPC 指令给设备获取最新状态，请用 *callMethod(method, params, extraInfo, callback)* 方法，并发送 get_props 指令。
>
>```js
>componentDidMount: function() {
>  // 指定发送 get_props 获取的属性集合
>  MHPluginSDK.registerDeviceStatusProps(["rgb"]);
>  // 订阅定期状态轮询的通知
>  var {DeviceEventEmitter} = require('react-native');
>  var subscription = DeviceEventEmitter.addListener(MHPluginSDK.deviceStatusUpdatedEventName,(notification) => {
>    // 从device属性的内存缓存中拿到轮询的状态结果
>    MHPluginSDK.getDevicePropertyFromMemCache(["rgb"], (props) => {
>      if (props.rgb)
>      {
>        var sRGB = "#" + this.getNewRGB(props.rgb >> 16, (props.rgb >> 8) & 0x00ff, (props.rgb & 0x0000ff));
>        // 设置 state 刷新页面
>        this.setState({"resultViewColor":sRGB});
>      }
>    });
>  });
>},
>
>```


#### *setDevicePropertyToMemCache(kvPairs)*
>向内存缓存中设置设备属性键值（不会发送网络请求）
>
>`kvPairs` 属性 key-value 字典
>
>**注意** 此方法并不会发送 RPC 指令给设备来设置状态，只是修改当前 APP 内存缓存中存储的对应属性值，可设置/获取的设备属性并不需要在设备的 profile 中，可以是任何合法的 key，实际上可以看作一片 key-value pair 形式存储的内存缓存，在退出插件时会被清空。
>
>想要发送 RPC 指令给设备获取最新状态，请用 *callMethod(method, params, extraInfo, callback)* 方法
>

```
// 可以看做是一片内存缓存，能存储任何值，通常是设备相关的属性。
MHPluginSDK.setDevicePropertyToMemCache({"power":"on", "abc":"def"});
```


#### *getDevicePropertyFromSrvCache(keys, callback)* `AL-[108,)`
>从服务器缓存中获取设备上报的属性值（会发送网络请求）
>
>`keys` 属性名数组
>`callback` 回调方法 **(Object kvPairs)**
>
>**注意** 此方法并不会发送 RPC 指令给设备来获取最新状态，只是返回当前 Server 中存储的对应属性值，可获取的设备属性需要在设备的 profile 中任何合法的 key，实际上可以看作一片 key-value pair，每次调用都会重新拉去服务器中最新值。

#### *getUTCFromServer(callback)* `AL-[125,)`

> 从米家服务器获取当前UTC时间戳（会发送网络请求）
>
> `callback` 回调方法 **(Object kvPairs)**

#### *openAddDeviceGroupPage*

> 打开创建设备组页
>
> **注意** 只有特定设备支持创建设备组统一管理，此方法目前只支持特定设备，使用请与米家联系。

#### *openEditDeviceGroupPage(dids)* `AL-[120,)`

> 打开编辑设备组页
> dids 组内现有设备的did数组(字符串数组)
>
> 获取设备组中设备did的方法如下
>
> ```javascript
> MHPluginSDK.callSmartHomeAPI('/home/virtualdevicectr',
>                              {"type":"get","masterDid":"virtual.138195"},
>                              (response) => {console.log(JSON.stringify(response));}
>                             );
> ```
>
>
>
> **注意** 只有特定设备支持编辑设备组统一管理，此方法目前只支持特定设备，使用请与米家联系。
```js
    MHPluginSDK.openEditDeviceGroupPage(["12345","67890"]);
```

#### *openTimerSettingPage(onMethod, onParam, offMethod, offParam)* `AL-[101,)`

>提供设备定时设置的统一页面，用来让用户设置设备的定时开关。
>
>`onMethod` 定时到时设备“开”执行的 RPC 指令命令字字符串
>`onParam` 定时到时设备“开”执行的 RPC 指令参数字符串（目前仅支持单参数）
>`offMethod` 定时到时设备“关”执行的 RPC 指令命令字字符串
>`offParam` 定时到时设备“关”执行的 RPC 指令参数字符串（目前仅支持单参数）
>
>```js
>MHPluginSDK.openTimerSettingPage("set_power", "on", "set_power", "off");
>```
>如果只有“开”或者“关”，只需要把用不到的参数置为null。
>
>```js
>MHPluginSDK.openTimerSettingPage("set_power", "on", null, null);//只有开
>```
>**注意** 可以把不需要的参数置为null，但是不可以不写。

#### *openCMTimerSettingPage(onMethod, onParam, offMethod, offParam, plugInterface)* `AL-[122,)`

>创米插排专用定时接口，只为了兼容早期的创米大插座，新产品建议采用openTimerSettingPage接口
>
>`onMethod` 定时到时设备“开”执行的 RPC 指令命令字字符串
>`onParam` 定时到时设备“开”执行的 RPC 指令参数字符串（目前仅支持单参数）
>`offMethod` 定时到时设备“关”执行的 RPC 指令命令字字符串
>`offParam` 定时到时设备“关”执行的 RPC 指令参数字符串（目前仅支持单参数）
>
>plugInterface：0位电源，1为usb
>
>```js
>MHPluginSDK.openCMTimerSettingPage("set_usb_on", null, "set_usb_off",null,1);//usb定时
>```

#### *openTimerSettingPageWithVariousTypeParams(onMethod, onParam, offMethod, offParam)* `AL-[101,)`

>提供设备定时设置的统一页面，用来让用户设置设备的定时开关。
>
>`onMethod` 定时到时设备“开”执行的 RPC 指令命令字字符串
>`onParam` 定时到时设备“开”执行的 RPC 指令参数，可以是字符串、数字、字典、数组
>`offMethod` 定时到时设备“关”执行的 RPC 指令命令字字符串
>`offParam` 定时到时设备“关”执行的 RPC 指令参数，可以是字符串、数字、字典、数组
>
>```js
>MHPluginSDK.openTimerSettingPageWithVariousTypeParams(
>"set_power", ['on', 'smooth', 500],
>"set_power", ['off', 'smooth', 500]);
>```
>如果只有“开”或者“关”，只需要把用不到的参数置为null。
>
>```js
>MHPluginSDK.openTimerSettingPageWithVariousTypeParams(
>null, null,
>"set_power", ['off', 'smooth', 500]);//只有关
>```
>**注意** 可以把不需要的参数置为null，但是不可以不写。

#### *requestBtGatewayListData(callback)* `AL-[140,)`

> 查看当前账户下是否有支持蓝牙网关功能的设备。若有，则返回蓝牙网关设备列表和附近可以接入的蓝牙设备。
>
> ```js
> MHPluginSDK.requestBtGatewayListData((isSuccess, result) => {
>   console.log(isSuccess, result);
> });
> // result格式如下：
> [
>     {
>         // 可接入该蓝牙网关设备的蓝牙设备
>         "linkingDevices": [
>             {
>                 "RSSI": 2, // 0 1 2 3 信号强度依次减弱
>                 "btDevice": {
>                     "did": "",
>                     "model": "",
>                     "isOnline": true,
>                     "mac": "",
>                     "name": ""
>                 }
>             }
>         ],
>         // 蓝牙网关设备
>         "btGatewayDevice": {
>             "did": "",
>             "version": "", // 固件版本号
>             "model": "",
>             "isOnline": true,
>             "mac": "",
>             "name": ""
>         }
>     }
> ]
> ```

#### *openDeviceTimeZoneSettingPage()* ` AL-[147,)` 

> 打开设备时区设置页面
>
> ```js
> MHPluginSDK.openDeviceTimeZoneSettingPage();
> ```

#### *openDeviceUpgradePage()*

> 打开设备固件升级页面
>
> **注意** 分享过来的设备是无法进行固件升级的，所以此时此方法无效。
>
> ```js
> MHPluginSDK.openDeviceUpgradePage();
> ```

#### *setFirmwareUpdateErrDic(message)* ` AL-[136,)`

> 为设备固件升级失败添加自定义的errorCode与错误提示信息的索引
>
> `message` 以errorCode为key，以错误提示信息为value的字典。key和value的数据类型都须是string。
>
> **注意** 分享过来的设备是无法进行固件升级的，所以此时此方法无效。
>
> ```js
> MHPluginSDK.setFirmwareUpdateErrDic({'1001': '请检查网络'});
> ```

#### *getAvailableFirmwareForDids(dids, callback)* `AL-[139,)`

> 获取固件的状态，可以确认是否需要升级，也可以获得当前的升级状态。
>
> `dids`设备did构成的数组
>
> `callback`回调方法 **(BOOL res, Object json)**
>
> 请求成功的回调中`json`有用字段
>
> - `currentVersion`当前固件版本号
> - `did`设备did
> - `isLatest`是否是最新版本
> - `latest`最新固件版本号
> - `otaFailedCode`OTA升级时的错误代码
> - `otaFailedReason`OTA升级失败的原因
> - `otaProgress`OTA进度
> - `otaStartTime`OTA开始时间
> - `otaStatus`当前OTA状态
> - `timeOutTime`允许超时时间
> - `updateState`固件当前状态，枚举值
>   - 0 初始化
>   - 1 可升级
>   - 2 设备离线，无法升级
>   - 3 下载固件
>   - 4 安装固件
>   - 5 安装完成
>   - 6 安装成功
>   - 7 安装失败
>   - 8 检测是否有固件可更新时出错 
>   - 9 状态未知
>   - 10 超时
>   - 11 其他错误
> - `updating`是否正在更新
>
> 请求失败的回调中`json`字段
>
> - `code`错误代码
> - `domain`错误分类
> - `localDescription `错误描述

```js
MHPluginSDK.getAvailableFirmwareForDids([MHPluginSDK.deviceId], (res, json) => {
  console.log(res, json);
  if (res && json.length > 0) {
    if (json[0].isLatest) {
      console.log('当前固件版本号：' +
                  json[0].currentVersion +
                  ' 无可用更新，不需要升级。')
    } else {
      console.log('有新的固件可升级！' + '当前版本号：' +
                  json[0].currentVersion + ' 新版本号：' +
                  json[0].latest);
    }
  }
});
```

#### *startUpgradingFirmwareWithDid(did, callback)* `AL-[139,)`

> 检查到有可用更新时，可以主动更新固件。
>
> `did`设备did
>
> `callback`回调方法 **(BOOL res, Object json)**
>
> 请求成功的回调中`json`是一个字符串：`'ok'`表示有可用升级并开始升级；`'already latest'`表示已经是最新版本，无需升级。
>
> 请求失败的回调中`json`字段
>
> - `code`错误代码
> - `domain`错误分类
> - `localDescription `错误描述
>
> 请求成功之后，在回调中可以调用`getAvailableFirmwareForDids`获取OTA的进度和状态。

```js
MHPluginSDK.startUpgradingFirmwareWithDid(MHPluginSDK.deviceId, (res, json) => {
  console.log(res, json);
  if (res && json === "ok") {
    // 当然这里应该定时调用，demo 这里只调用了一次
    MHPluginSDK.getAvailableFirmwareForDids([MHPluginSDK.deviceId], (res, json) => {
      if (res && json.length > 0) {
        let status = json[0].updateState;
        switch (status) {
          case 3:
            this.setState({ currentStatus: "下载中" });
            break;
          case 4:
            this.setState({ currentStatus: "安装中" });
            break;
          case 5:
            this.setState({ currentStatus: "安装完成" });
            break;
        }
        // 还可以根据otaProgress属性更新ProgressBar组件或者刷新进度条
      }
    })
  } else if (res && json === "already latest") {
    console.log("无可用更新，无需升级");
  } else if (!res) {
    console.log("更新失败", JSON.stringify(json));
  }
})
```

#### *closeCurrentPage()*

>退出插件
>
>**注意** 如果在插件设置页，则会退出设置页。

#### *openDeleteDevice()* `AL-[107,)`

> 解除设备绑定，设备会从用户的设备列表中删除，断开连接
>
> **注意** 调用后，插件会立即退出
>
> ```javascript
> MHPluginSDK.openDeleteDevice();
> ```

#### *openDeleteDeviceWithCustomMessage(message)* `AL-[126,)`

> 功能同`openDeleteDevice`，支持自定义解绑时弹出确认框中的文字提示
>
> **注意** 调用后，插件会立即退出
>
> ```javascript
> MHPluginSDK.openDeleteDeviceWithCustomMessage("some tips");
> ```

#### *showFinishTips(content)*

>显示一个已完成提示，时长1秒
>
```
MHPluginSDK.showFinishTips("数据获取成功！");
```

#### *showFailTips(content)*

>显示一个失败的提示，时长1s
>
>```js
>MHPluginSDK.showFailTips("数据获取失败！");
>```


#### *showLoadingTips(content)*

>显示一个正在加载提示，一直存在直到调用 *dismissTips*

#### *dismissTips()*

>使提示消失

#### *showBLESwitchGuide*() `AL-[128,)`

> 显示一个引导动画，提示用户打开手机蓝牙开关。

#### *dismissBLESwitchGuide()* `AL-[128,)`

> 隐藏蓝牙开关引导动画。注：用户如果与动画有手势交互，动画隐藏，则无需再调用此方法。

#### *openShareListBar(title, description, path, url)*

>打开外链分享界面，用户可以选择分享到微信、朋友圈、米聊或QQ
>
>`title` 标题
>`description` 说明
>`path` 缩略图路径（可以是本地 basePath+imagePath 形式，也可以是网络图片 http://）
>`url` 网页URL
>
>```js
>MHPluginSDK.openShareListBar("米家开放平台", "小米智能火箭筒专卖", MHPluginSDK.basePath+"rockets.png", "http://open.home.mi.com");
>```


#### *shareToWeChatSession(title, description, path, url)*

>直接分享到微信聊天
>
>`title` 标题
>`description` 说明
>`path` 缩略图路径（可以是本地 basePath+imagePath 形式，也可以是网络图片 http://）
>`url` 网页URL



#### *shareToWeChatMoment(title, description, path, url)*
>直接分享到微信朋友圈
>
>`title` 标题
>`description` 说明
>`path` 缩略图路径（可以是本地 basePath+imagePath 形式，也可以是网络图片 http://）
>`url` 网页URL

#### *openShareDevicePage()*
>分享设备
>



#### *shareToWB(title, description, path, url)*
>直接分享到微博
>
>`title` 标题
>`description` 说明
>`path` 缩略图路径（可以是本地 basePath+imagePath 形式，也可以是网络图片 http://）
>`url` 网页URL

#### *shareToML(title, description, path, url)*
>直接分享到米聊
>
>`title` 标题
>`description` 说明
>`path` 缩略图路径（可以是本地 basePath+imagePath 形式，也可以是网络图片 http://）
>`url` 网页URL


#### *onShare* `AL-[125,)` 

> 全屏截图并分享到社交媒体
>
> MHPluginSDK.onShare();
>


#### *openPrivacyLicense* `AL-[129,)` 

>  授权用户使用条款和隐私协议
>
>  `userAgreement`  用户使用条款的名称
>
>  `userAgreementURL` 用户使用条款详细内容的url
>
>  `privacyPolicy` 隐私协议的名称
>
>  `privacyPolicyURL`  隐私协议的详细内容的url
>
>  `callBack`  同意或者取消授权的回调，同意时`result` 为`ok`
>

```
  MHPluginSDK.openPrivacyLicense("license","licenseURL","policy, "policyURL,(result)=>{
    if(result == "ok") {

    } else {

    }
  })
```

#### *privacyAndProtocolReview* `AL-[133,)` 

>  查看用户使用条款和隐私协议
>
>  `userAgreement`  用户使用条款的名称
>
>  `userAgreementURL` 用户使用条款详细内容的url
>
>  `privacyPolicy` 隐私协议的名称
>
>  `privacyPolicyURL`  隐私协议的详细内容的url
>
>   撤销授权的通知请监听：deviceCancelAuthorization
>

```
MHPluginSDK.privacyAndProtocolReview(userAgreement, userAgreementURL, privacyPolicy, privacyPolicyURL);

```

#### *saveInfo(info)*

>使用 NSUserDefaults 缓存一个字典
>
>`info` 字典，值只能是简单数据类型
>
>**注意** 使用 NSUserDefaults 存储，退出插件不会消失，适合做轻量级数据的本地化存储。大数据量请使用 MHPluginFS 模块。


#### *loadInfoCallback(callback)*

>读取缓存在 NSUserDefaults 中的信息，（使用 *saveInfo(info)* 存储的）
>
>`callback` 回调方法 **(Object info)**
>
>**注意** 使用 NSUserDefaults 存储，退出插件不会消失，适合做轻量级数据的本地化存储。大数据量请使用 MHPluginFS 模块。



#### *loadCurrentPlaceMarkCallback(callback)*

>读取当前位置的省市信息（手机）
>
>`callback` 回调方法 **(Object placeMark, Array loopbackParams)**
>

```
MHPluginSDK.loadCurrentPlaceMarkCallback((placeMark, loopbackParams) => {
  console.log(plackMark);
});
```

#### *loadDeviceCurrentPlaceMarkCallback(callback)*

>读取当前位置的省市信息（设备上一次绑定的位置）
>
>`callback` 回调方法 **(Object placeMark, Array loopbackParams)**
>
>```js
>MHPluginSDK.loadDeviceCurrentPlaceMarkCallback((placeMark, loopbackParams) => {
>  console.log(plackMark);
>});
>```


#### ~~*addRecord(type, value, extra)* 已弃用~~

> ~~添加插件自定义统计事件点~~
>
> ~~`type` 自定义事件类型字符串~~
> ~~`value` 自定义值字典~~
> ~~`extra` 附加字典，一般传空{}~~

#### *finishCustomSceneSetupWithTrigger(trigger)* `AL-[107,)`
>完成场景设置，回传设置后的 trigger</b>
>
>`trigger` 设置后的自定义场景trigger
>
>**注意** 此方法只在开发自定义智能场景触发条件时使用，作用是插件自定义场景处理完成时将处理好的 trigger 回传，请参见”开发自定义智能场景“章节



#### *finishCustomSceneSetupWithAction(action)* `AL-[107,)`
>完成场景设置，回传设置后的 action</b>
>
>`action` 设置后的自定义场景action
>
>**注意** 此方法只在开发自定义智能场景动作时使用，作用是插件自定义场景处理完成时将处理好的 action 回传，请参见”开发自定义智能场景“章节



#### *finishCustomSceneSetup(payload)* `AL-[100,106](deprecated)`
>完成场景设置，回传设置后的 payload</b>
>
>`payload` 设置后的自定义场景payload
>
>**注意** 此方法只在开发自定义智能场景插件 bundle 时使用，作用是插件自定义场景处理完成时将处理好的 payload 回传，请参见”开发自定义智能场景“章节
>**注意** 此方法回传的payload会填到value字段里，无法自定义其它字段，已废弃，请使用finishCustomSceneSetupWithTrigger/Action方法替代

#### *onFinishing(devices, model, callback)* ` AL-[110,)`

> 把设备添加到设备列表当中
>
> `devices`需要添加到设备列表的设备数组，如果是普通设备则传device id数组，如果是蓝牙设备则传identifier数组
>
> `model` 设备的model
>
> `callback(error, devices)` error表示错误信息，devices表示成功添加到设备列表的设备信息

```javascript
MHPluginSDK.onFinishing([peripheral.identifier], 'xiaomi.bledemo.v1', (error, body) => {
      if (!error && body.model === 'xiaomi.bledemo.v1') {
        var devices = body.devices;
        for (const device of Object.values(devices)) {
          if(device.peripheral === peripheral.identifier){
            MHPluginSDK.openDevice(device.did, 'xiaomi.bledemo.v1', () => {
            });
            break;
          }
        }
      }
    });
```

#### *openDevice(did, model, callback)* ` AL-[110,)`

> 打开某设备列表中的某个设备
>
> `did` 需要打开的设备的device id
>
> `model` 需要打开设备的model
>
> `callback(error, device)` error表示错误信息，device表示被打开的设备信息

```javascript
MHPluginSDK.openDevice(device.did, 'xiaomi.bledemo.v1', () => {});
```

#### *applyForDeviceIDAndToken(model, mac,callback)* ` AL-[110,)`

> 未某设备向服务器申请did和token
>
> `model` 设备的model
>
> `mac` 设备的mac地址
>
> `callback(error, info, did, token)` error表示错误信息，info表示设备信息，did设备申请的did，token设备申请回来的token。

```javascript
MHPluginSDK.applyForDeviceIDAndToken('xiaomi.bledemo.v1', '23:23:93:a3:98', (error, info, did, token) => {
  if(error){
    MHPluginSDK.showFailTips('申请失败：'+error.message);
  }else{
    //do your work!
  }
});
```

#### *bindDevice(model, mac, did, token, name, passwd, callback)* ` AL-[110,)`

> 绑定设备到米家客户端（云端绑定方式）
>
> `model` 设备的model
>
> `mac` 设备的mac地址
>
> `did` 设备从云端申请的的did
>
> `token` 设备从云端申请的token
>
> `name` 设备报给云端的设备名称
>
> `passwd` 设备的密码
>
> `callback(error, info)` error表示错误信息，info表示被绑定的设备信息

```javascript
MHPluginSDK.openDevice('xiaomi.bledemo.v1', '23:23:93:a3:98', '23fasdf3asd', 'asf2fje2iufsfyfds', '小米火箭筒', '123', (error, info) => {
  if(error){
    MHPluginSDK.showFailTips('绑定失败：'+error.message);
  }else{
    //do your work!
  }
});
```

#### *getDevicesWithModel(model, callback)* `AL-[112,)`

>获取设备列表中指定model的设备信息
>`callback` 回调方法 (success, devices) success 为true时devices中存储设备信息数组

```javascript
MHPluginSDK.getDevicesWithModel("xiaomi.watch.band2",(success,devices) =>{
            if (success) {
              alert(JSON.stringify(devices));
            }

          })
```
#### *callSpecMethod(method,params,callback)* ` pre_release`

>MiotSpec方法，暂时只支持获取、设置设备的属性
>
>` method` string类型，用于区分操作类型：get_properties 获取设备属性、set_properties 设置设备属性
>
>`params` 用于存放方法参数字典的数组（支持同时获取、设置多个属性），字典内具体参数参照下文。
>
>` callback(bool,array)` 返回成功/失败标识，以及结果/error。
>
>**get_properties**
>
>key:did    value:设备did
>
>key:siid   value:设备siid
>
>key:piid   value:设备piid
>
>**set_properties**
>
>key:did      value:设备did
>
>key:siid      value:设备siid
>
>key:piid     value:设备piid
>
>key:value  value:要设置的值

```js
var array = [{
    			did: 123,
    			siid: 456,
    			piid: 789
			}];
MHPluginSDK.callSpecMethod("get_properties",array,(success,message) => {
    if (success) {
        JSON.stringify(message)
    }
})
```



#### *firmwareNotCheckUpdate(notCheckUpdateFlag, callback)* `AL-[116,)`

>设置设备控制页不检查固件升级
>`callback` 回调方法 (success, message)

```javascript
//设置不检查更新
MHPluginSDK.firmwareNotCheckUpdate(true,(success,message) =>{
            if (success) {
              alert(message);
            }

          })
//检查更新则设置回来
MHPluginSDK.firmwareNotCheckUpdate(false,(success,message) =>{
            if (success) {
              alert(message);
            }

          })
```

#### *getCurrentCountryInfoCallback(callback)* `AL-[117,)`
>获取当前登录的国家/地区
>`callback` 回调方法 (success, countryInfo) ，success 为 *true* 时表示成功获取
>`countryInfo`： countryName: 国家 / 地区名称;  countryCode: 国家 / 地区代码 ;serverCode: 服务器代码 `AL-[126,)`

```javascript
MHPluginSDK.getCurrentCountryInfoCallback((success, countryInfo) => {
    if (success) {
        console.log(countryInfo);
    }
})
```
#### *openPageWithClassName(className)* `AL-[116,)`

>打开一个原生类
>`className` ，界面类类名
>**注意** 用此方法打开的vc初始化时不需要传参数，需要传参的viewController暂时还需要手动导出

```javascript
MHPluginSDK.openPageWithClassName("MHIFTTTMySceneViewController");
```
#### *getMiWatchConfigWithCallback(callback)* `AL-[119,)`

>华米watch配置使用
>`callback` ，结果回调


```javascript
MHPluginSDK.getMiWatchConfigWithCallback((success,config) =>{
            if (success) {
              console.log(JSON.stringify(config));
            }else {
            //config is a error object
              console.log(JSON.stringify(config));
            }
          });
```
#### *openRoomManagementPage* `AL-[119,)`

> 打开位置管理页面
>
> **注意** 分享过来的设备是无法进行位置管理的，所以此时此方法无效。
>
> ```js
> MHPluginSDK.openRoomManagementPage();
> ```



#### *getAutoRecordWithDid(did,callback)* `AL-[141,]`

> 获取自动化名称和id
>
> `did`,设备did
>
> `callback`,回调方法 (success, result) ，success 为 *true* 时表示成功获取,result为自动化数据数组
>
> ```js
> MHPluginSDK.getAutoRecordWithDid('123',(success,result)=> {
>     if (success) {
>         console.log(JSON.stringify(result));
>     }
> })
> ```



#### *openIftttAutoPage* `AL-[119,)`

> 打开自动化页面
>
> **注意** 分享过来的设备是无法进行自动化管理的，所以此时此方法无效。
>
> ```js
> MHPluginSDK.openIftttAutoPage();
> ```

#### *openNewMorePage* `AL-[119,)`

> 打开更多设置页面（通常包括安全设置，常见问题与用户反馈）
>
> **注意** API Level 小于 `127` 时，被分享的设备无法调用此接口；被分享者调用此接口时，不提供安全设置项
>
> ```js
> MHPluginSDK.openNewMorePage();
> ```

#### *openAddToDesktopPage* `AL-[119,)`

> 打开添加到桌面设置页面
>
> ```js
> MHPluginSDK.openAddToDesktopPage();
> ```

#### *actualIconUrlForModel(model,callback)* `AL-[119,)`

> 获取设备实物图
>
> ```js
> MHPluginSDK.actualIconUrlForModel("xiaomi.demo.v1",(success, url)=>{
>     if(success){
> 			alert(url);
>     }
> });
> ```

#### *getUserConfigs(componentId,keys,callback)* `AL-[121,)`

> 获取存储的userConfig
>
> 注意：componentId需要向米家后台申请，不用用未申请的componentId，破坏其他插件的数据
>
>
>
> ```js
> MHPluginSDK.getUserConfigs(20000, [0,100], (success, config, error)=>{
>     if(success){
> 			alert(JSON.stringify(config));
>     }else{
>           alert(JSON.stringify(error));
>     }
> });
> ```


#### *setUserConfigs(componentId,data,callback)* `AL-[121,)`

> 云端存储**与用户相关数据**。会跟随账户，注意与 `/device/setsetting` 存储[设备相关数据](./callSmartHomeAPI.md)的接口区分。
>
> 同一用户（解绑）删除某设备之后，添加同 model 设备，userconfigs 数据不会被删除。
>
> 注意：componentId需要向米家后台申请，不要用未申请的componentId，破坏其他插件的数据
>
> data中key （例子中是0、100）要间隔开，底层会根据数据大小分包存储，建议隔100一个key，key的最大值为3万多
>
> ```js
> MHPluginSDK.setUserConfigs(20000,{0:{"data":"value"},100:{"data100":"value100"}},(success, error) => {
>         if (success) {
>             console.log("success set");
>             MHPluginSDK.getUserConfigs(20000,[0,100],(success, config,error) => {
>                console.log('success' + success+"config" + JSON.stringify(config) + "error" + error);
>             });
>         }else {
>             console.log(JSON.stringify(error));
>           }
>     });
> ```

#### *getSystemTimezoneNameWithCallback* `AL-[122,)`

> 获取系统时区名字
>
> ```js
>  MHPluginSDK.getSystemTimezoneNameWithCallback((success, timezoneName)  => {
>            console.log(JSON.stringify(timezoneName));
>          });
>
> ```


#### ~~*openNewSettingPage*~~  (废弃， 请使用Demo 工程中提供的MHSetting页面)

> 打开设置界面
>
> ```js
> MHPluginSDK.openNewSettingPage();
>
> ```


#### *openFeedbackInput*  

> 打开反馈输入界面
>
> ```js
> MHPluginSDK.openFeedbackInput();
>
> ```

#### openVoiceCtrlDeviceAuthPage `AL-[131,)`

> 打开语音设备授权控制页面。注意，不具有语音控制能力的设备与分享的设备不要调用此接口。
>
> ```js
> MHPluginSDK.openVoiceCtrlDeviceAuthPage();
> ```

#### getUserDeviceData 获取设备上报的属性和事件历史记录

> @param model 设别model
>
> @param did 设备的ID
>
> @param type 查询属性 type 用 prop， 查询事件 type 用event
>
> @param key 属性名，不需要用 prop 或者 event  前缀
>
> @param timeStart 起点时间，单位为秒
>
> @param timeEnd 终点时间，单位为秒
>
> @param callback 回调

```javascript
MHPluginSDK.getUserDeviceData(MHPluginSDK.deviceModel,MHPluginSDK.deviceId,'prop','power',1500083422,1500383422,(response,err)=>{
  console.log("🔴 getUserDeviceData");
  if(err){
    console.log("error");
    return;
  }
  console.log(response)
});
```


#### *addCustomSettingItemWithTitle*

>添加自定义设置项 的文字和事件：

>第一个参数为设置项的名字
>
>第二个参数为设置项包含的事件（相当于NSNotification 中的key，这个函数就相当于
>post 通知）

```
MHPluginSDK.addCustomSettingItemWithTitle('custom setting','custom.setting');

```

#### *shareSecureKey(did,shareUid,status,activeTime,expireTime,week,readonly,callback)* `AL-[125,)`

> 分享设备电子钥匙，支持安全芯片的设备可调用

>  @param did 分享设备的did
>
>  @param shareUid 分享目标的uid
>
>  @param status 分享类别，1：暂时，2：周期，3：永久
>
>  @param activeTime 生效时间 UTC时间戳，单位为s
>
>  @param expireTime 过期时间 UTC时间戳，单位为s
>
>  @param week 生效日期（星期几，例如周一和周三对应1和3，[1, 3]），仅在status=2时不可为空
>
>  @param readonly 被分享人是否接受设备push，为 false 时接受，为 true 则不接受
>
>   @param callback

```javascript
var now = Math.floor(Date.now() / 1000);

MHPluginSDK.shareSecureKey(MHPluginSDK.deviceId,"someone's mi id", 1, now, now + 3600,[],false,(isSuccess,response)=>{
  if(!isSuccess){
    console.log("some error " + JSON.stringify(response));
    return;
  }
  //success
});

```

#### *updateSecureKey(did,keyId,status,activeTime,expireTime,week,callback)*`AL-[125,)`

> 更新已分享的设备电子钥匙，支持安全芯片的设备可调用

>   @param did 分享设备的did
>
>   @param keyid 电子钥匙id，可通过 *getSecureKey* 方法获取
>
>   @param status 分享类别，1：暂时，2：周期，3：永久
>
>   @param activeTime 生效时间 UTC时间戳，单位为s
>
>   @param expireTime 过期时间 UTC时间戳，单位为s
>
>   @param week 生效日期（星期几，例如周一和周三对应1和3，[1, 3]），仅在status=2时不可为空
>
>   @param callback

```javascript
var now = Math.floor(Date.now() / 1000);

MHPluginSDK.updateSecureKey(MHPlugin.deviceId,"someone's keyid", 1, now, now + 3600,[],(isSuccess,response)=>{
  if(!isSuccess){
    console.log("some error " + JSON.stringify(response));
    return;
  }
  //success
});

```

#### *deleteSecureKey(did,keyId,callback)*`AL-[125,)`

> 删除已分享的设备电子钥匙，支持安全芯片的设备可调用

>  @param did 分享设备的did
>
>  @param keyid 电子钥匙id
>
>  @param callback

```javascript
MHPluginSDK.deleteSecureKey(MHPlugin.deviceId,"someone's keyid",(isSuccess,response)=>{
  if(!isSuccess){
    console.log("some error " + JSON.stringify(response));
    return;
  }
  //success
});
```

#### *getSecureKey(did,callback)*`AL-[125,)`

> 获取当前设备所有分享出去的电子钥匙，支持安全芯片的设备可调用

>  @param did 分享设备的did
>
>  @param callback

```javascript
MHPluginSDK.getSecureKey(MHPlugin.deviceId,(isSuccess,response)=>{
  if(!isSuccess){
    console.log("some error " + JSON.stringify(response));
    return;
  }
  //success, get all the keyid of the device
});
```


#### *keepScreenNotLock(flag)* `AL-[112,)`

>保持屏幕常亮，flag为true 或者 false
>不需要时需要设置回去！！！

#### *getConnectedWifi(callBack)* `AL-[138,)`

>获取手机所连接的wifi信息
>
>暂时信息里只有SSID 与 BSSID

```js
MHPluginSDK.getConnectedWifi((isSuccess,message) =>{
	if(isSuccess){
        let ssid = message["SSID"];
        let bssid = message["BSSID"];
	}
});
```
#### *getServiceTokenWithSid* `AL-[138,)`
> 传入域名返回 serverToken 等信息，**目前只支持小爱音箱的域名**

```javascript
MHPluginSDK.getServiceTokenWithSid("xxx.xiaomi.com",(error,result)=>{
  if(!error) {
    result["serviceToken"]
    result["ph"]
    result["slh"]
    result["cUserId"]
  }
});
```

#### *deviceToken(callback)* `AL-[140,)`

> 获取设备 Token。设备 Token 在设备快连入网时生成，能唯一标识设备的生命周期，直至被重置、重新快连入网。注意该 Token 并非设备与服务器交互时认证所用 Token，只能用于标识作用。

```javascript
MHPluginSDK.deviceToken((success,token)=>{
    if(success){
    	//console.log(token)
     }
});
```
#### *getInfraredGatewayDevice(callback)* `AL-[142,)`
> 得到红外网关设备

>  @param callback 回调方法 **( Object devices)** 

```js
MHPluginSDK.getInfraredGatewayDevice((devices)=>{
    //devices 是红外设备
    if (devices.length > 0) {

    }

});
```

#### *openConnectSucceedPage(model,did)* `AL-[141,)`
> 打开快联成功页面

>  @param model 快联成功的设备model
>
>  @param did 快联成功的设备did
> 

```
MHPluginSDK.openConnectSucceedPage(model,did);
```

#### *jumpWifiSettingPage* `AL-[143,)`
> 跳转至系统设置页中无线局域网（WiFi）列表
> 

```
MHPluginSDK.jumpWifiSettingPage();
```



#### *goToMeshGateWayGuideLineWebView* `AL-[146,)`

> 跳转至`蓝牙mesh网关`的用户指南页面

```
MHPluginSDK.goToMeshGateWayGuideLineWebView();
```





### 订阅

#### 订阅设备状态的更新

当扩展程序运行在前台时，可以通过调用  `registerDeviceStatusProps `方法注册设备的属性和事件，同时监听 `deviceStatusUpdatedEventName` 常量。

当米家 App 获取到设备属性、事件时，会通过常量发出通知。插件监听通知，从内存中获取对应结果从而进行相应处理。

获取设备状态模式分为两种：轮询和订阅，在 `config.plist` 中可以配置。前者为定时向设备发送 rpc 命令查询结果，后者为设备属性发生变化或事件发生时，服务器端基于小米推送向客户端发送 push，插件通过监听 `deviceStatusUpdatedEventName` 得到变化的值。

示例：

```js
// 假设采用订阅方式，需在 key 之前加前缀，属性为 prop.xxx, 事件为 event.xxx
MHPluginSDK.registerDeviceStatusProps(["prop.rgb","prop.power","event.isOn"]);

// 若采用轮询方法，则无法轮询事件，只能查询 prop，直接填入 key
// MHPluginSDK.registerDeviceStatusProps(["rgb","power"]);

// 记得初始化 DeviceEventEmitter
const {DeviceEventEmitter} = require('react-native');
// 监听
let subscription = DeviceEventEmitter.addListener(MHPluginSDK.deviceStatusUpdatedEventName,(notification) => {

 // 从device属性的内存缓存中拿到轮询的状态结果，同样，订阅需要添加前缀，轮询不用
 MHPluginSDK.getDevicePropertyFromMemCache(["prop.rgb","prop.power","event.isOn"], (result) => {
   console.log(result);
 });

});
```

#### 订阅APNS推送

- 米家APP在后台时，收到苹果的 APNS (*Apple Push Notification Service*)推送，用户点击推送会启动米家 APP，并转到相应推送设备的插件首页，此时 `MHPluginSDK.extraInfo` 里包含了推送的相关参数。
- 米家APP在前台时，收到苹果的 APNS 推送，如果此时相关设备插件未启动，则会弹出一个 Alert 提示用户转到相应的插件，携带参数同上。
- 米家APP在前台时，收到苹果的 APNS 推送，如果此时相关设备插件正在展示，则不再弹出 Alert。插件只需监听 `onReceivingForegroundPushEventName` 常量，就会收到本通知，携带参数在通知回调中给出。

示例：

```js
var {DeviceEventEmitter} = require('react-native');
var subscription = DeviceEventEmitter.addListener(MHPluginSDK.onReceivingForegroundPushEventName,(notification) => {
    // 插件在前台收到push的通知回调
    console.log(JSON.stringify(notification));
  });
```

推送的相关参数，即 `pushMessage` 。插件只接收与设备相关的 `pushMessage` ，数据格式如下：

```json
{
  "did": "50602798",
  "value": {
  },
  "event": "alarm",
  "time": 1452173835
}
```

