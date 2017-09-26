# MiHomePlugin API参考文档
## MHPluginSDK模块 `AL-[100,)`

MHPluginSDK 模块主要提供插件与米家主APP、智能设备，以及米家云端交互的API。包括获取设备信息、设置设备属性、向设备发送指令、访问米家云端接口、访问特定UI资源等等。

```js
// 模块初始化
var MHPluginSDK = require('NativeModules').MHPluginSDK;
```

### 常量
#### *userId*
>当前登录用户的小米id
>
>String
>
>```js
>var userId = MHPluginSDK.userId;
>```

#### *userName* 
>当前登录用户的昵称
>
>String

#### *avatarURL* `AL-[122,)`
>当前登录用户的昵称
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
>


### 可以在插件端监听的事件
#### *deviceStatusUpdatedEventName*
>设备状态更新
>
>在插件运行在前台时，可以通过调用 registerDeviceStatusProps 方法（见下文档）注册属性值变化的监听，注册分两种，轮询获取属性或订阅（mipush的推送），推荐使用订阅方式。方式的选择可以通过config.plist中的pluginFetchPropStatusMode key设置
>
>当采用轮询方式时，APP会定期（默认每 6s 一次，可通过 config.plist 中的配置项进行调整）向设备发送 get_props 请求来获取设备指定属性集合的最新状态。之后插件会接收到本事件，触发事件回调。
>
>插件可以在该事件回调中进行相应的 state 设置，从而触发界面更新，来展示设备的最新状态。
>
>```js
>componentDidMount: function() {
>  // 指定发送 get_props 获取的属性集合
>  MHPluginSDK.registerDeviceStatusProps(["prop.rgb","prop.power"]);
>  // 如采用轮询，则为 
>  //MHPluginSDK.registerDeviceStatusProps(["rgb","power"]);
>  // 订阅定期状态轮询的通知
>  var {DeviceEventEmitter} = require('react-native');
>  var subscription = DeviceEventEmitter.addListener(MHPluginSDK.deviceStatusUpdatedEventName,(notification) => {
>    // 从device属性的内存缓存中拿到轮询的状态结果
>    MHPluginSDK.getDevicePropertyFromMemCache(["rgb","power"], (props) => {
>      if (props.rgb)
>      {
>        var sRGB = "#" + this.getNewRGB(props.rgb >> 16, (props.rgb >> 8) & 0x00ff, (props.rgb & 0x0000ff));
>        // 设置 state 刷新页面
>        this.setState({"resultViewColor":sRGB});
>      }
>    });
>  });
>},
>```


#### *onReceivingForegroundPushEventName*
>插件在前台时收到 APNS 推送
>
>米家APP在后台时，收到苹果的 APNS 推送，用户点击推送会启动米家 APP，并转到相应推送设备的插件首页，此时 MHPluginSDK.extraInfo 里包含了推送的相关参数。
>
>米家APP在前台时，收到苹果的 APNS 推送，如果此时相关设备插件未启动，则会弹出一个 Alert 提示用户转到相应的插件，携带参数同上。
>
>米家APP在前台时，收到苹果的 APNS 推送，如果此时相关设备插件正在展示，则不再弹出 Alert，插件会收到本通知，并触发通知的事件回调，携带参数在通知回调中给出。

```
var {DeviceEventEmitter} = require('react-native');
var subscription = DeviceEventEmitter.addListener(MHPluginSDK.onReceivingForegroundPushEventName,(notification) => {
    // 插件在前台收到push通知回调
    console.log(JSON.stringify(notification));
  });
```

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


### 资源 URI

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



### API

#### *keepScreenNotLock(flag)* `AL-[112,)`

>保持屏幕常亮，flag为true 或者 false
>不需要时需要设置回去！！！


#### *sendEvent(eventName, body)*

>发送一个事件。
>
>`eventName` 事件名字符串
>`body` 事件传递的参数字典，值只能为字符串、数值等简单类型，不能传递对象。
>
>其它模块可通过 DeviceEventEmitter.addListener 方法来注册并响应 sendEvent 发送的事件。



#### *registerDeviceStatusProps(propArr)*

>设置定时向设备RPC获取属性时的属性名集合
>
>`propArr` 注册定时向发送 get_props 获取的属性名数组，具体参见该设备的 profile
>
>```js
>  // 假设灯的 profile 中有 power/brightness/color 几个属性
>  MHPluginSDK.registerDeviceStatusProps(["prop.power", "prop.brightness", "prop.color"]); 
>
>  //如果是轮询方式
>  //MHPluginSDK.registerDeviceStatusProps(["power", "brightness", "color"]);
>
>  // APP会在插件运行时每6s获取一次灯的电源开关状态、亮度以及颜色值，插件通过监听 MHPluginSDK.deviceStatusUpdatedEventName 来处理回调。
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

```
// toggle 命令切换插座的开关状态，该命令没有参数，强制走局域网RPC
MHPluginSDK.callMethodForceWay('toggle',[],{},1, (isSuccess, json) => {
  console.log("toggle result:"+isSuccess+json);
  if (isSuccess)
  {
    this.setState({
      currentState: this.state.currentState == 'on' ? 'off' : 'on',
    });
  }
});
```



#### *callSmartHomeAPI(api, params, callback)*

>调用米家云端 API
>
>`api` 云端提供的 API 接口命令字字符串
>`params` 参数字典或数组（视具体 API 而定）
>`callback` 回调方法 **(Object response)**
>
>具体不同设备开放的云端接口请参照与米家云端对接时提供的文档或说明，以云端给出的信息为准。
>
>**支持的部分云端 API：**
>
>- `/scene/list` 获取设备定时列表
>
>
>
>- `/scene/delete` 删除设备定时
>
>
>
>- `/scene/edit` 创建（编辑）设备定时
>
>
>
>- `/home/latest_version` {"model": model} 获取最新固件版本（蓝牙设备）
>
>
>
>- `/home/checkversion` {"pid":0, "did":did} 获取最新固件版本（WIFI设备）
>
>
>插件获取设备上报给米家云端的 属性 与 事件 接口（包含蓝牙设备通过蓝牙网关上报的数据）：
>
>- ​	`/user/get_user_device_data`  读取与时间相关数据，请求参数示例：
>
>```javascript
>    {
>      "did":"123",   //设备 id
>      "uid":'123',   //要查询的用户 uid 
>      "key":"power", //与上报时一致
>      "type":"prop", //与上报时一致，属性 为 prop ，事件为 event
>      "time_start":"1473841870", //数据起点时间，单位为秒
>      "time_end":"1473841880", //数据终点时间，单位为为秒
>      "group": //返回数据的方式，默认 raw , 可选值为 hour、day、week、 month。
>      "limit": //返回数据的条数，默认 20，最大 1000
>    }
>```
>
>- ​	`/device/batchdevicedatas` 读取与时间无关数据，请求参数示例：
>
>```javascript
>{
>  "0":{
>    "did":"311223", //设备 id
>    "props":["prop.usb_on","prop.on"]
>  },
>   "1":{
>     "did":"311304",
>     "props":["prop.usb_on","prop.on"]
>  }
>}
>```
>
>- `/user/set_user_device_data`   插件上报设备数据（属性与事件）至米家云端，支持批量，请求参数示例：
>
>
>```javascript
>{
>  "0": {
>    "uid": "xxx", //用户 uid
>    "did": "123", //设备id
>    "time": "1473841870", //时间戳，单位为秒
>    "type": "prop", // 属性为 prop，事件为 event
>    "key": "power",
>    "value": {} 
>  },
>  "1": {
>    "uid": "xxx",
>    "did": "456",
>    "time": "1473841888",
>    "type": "prop",
>    "key": "power",
>    "value": {}
>  }
>}
>```
>
>*注：米家服务器不解析该 `value` 故可按照自身需要定义内部格式，只要保证 `value` 最终是 `string` 即可。*	
>
>插件存取跟设备相关数据，设备解绑（被用户删除）时，数据会被服务器自动清理
>
>- `/device/getsetting` 获取数据，参数示例：
>
>  ```json
>  {
>  "did":xxx,
>  "settings":["keyid_xxx_data"]
>  }
>  ```
>
>- `/device/setsetting` 设置数据，参数示例：
>
>  ```json
>  {
>   "did":xxx,
>   "settings":{
>      "keyid_xxx_data": "value1"
>   }
>  }
>  ```

示例：

>```js
>// 获取当前设备固件版本
>MHPluginSDK.getDevicePropertyFromMemCache(["version"], (props) => {
>  console.log("current version"+props.version);
>});
>// 获取最新固件版本（蓝牙设备）
>MHPluginSDK.callSmartHomeAPI("/home/latest_version", {"model":MHPluginSDK.deviceModel}, (response) => {
>  console.log("latest version"+JSON.stringify(response));
>});
>// 获取最新固件版本（WIFI设备）
>// pid 固定为0
>MHPluginSDK.callSmartHomeAPI("/home/checkversion", {"pid":0, "did":MHPluginSDK.deviceId}, (response) => {
>  console.log("latest version"+JSON.stringify(response));
>});
>// 删除已经设置的定时
>MHPluginSDK.callSmartHomeAPI('/scene/delete', delDate, (response) => {
>  AlertIOS.alert(JSON.stringify(response));
>});
>// 获取设备上报数据
>MHPluginSDK.callSmartHomeAPI('/user/get_user_device_data',{"did":MHPluginSDK.deviceId,"uid":MHPluginSDK.ownerId,"key":"power","type":"prop","time_start":"1473841870","time_end":"1473841880"}, (response) => {
>  AlertIOS.alert(JSON.stringify(response));
>});
>```

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

#### openAddDeviceGroupPage*

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

#### *openDeviceUpgradePage()*

> 打开设备固件升级页面
>
> **注意** 分享过来的设备是无法进行固件升级的，所以此时此方法无效。
>
> ```js
> MHPluginSDK.openDeviceUpgradePage();
> ```

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


#### *addRecord(type, value, extra)*

> 添加插件自定义统计事件点
>
> `type` 自定义事件类型字符串
> `value` 自定义值字典
> `extra` 附加字典，一般传空{}

```
MHPluginSDK.addRecord("kick_me", {"times": 2}, {});
```



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
>`countryInfo`： countryName: 国家 / 地区名称;  countryCode: 国家 / 地区代码 ;serverCode: 服务器代码(pre-release)

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

#### *openIftttAutoPage* `AL-[119,)`

> 打开自动化页面
>
> **注意** 分享过来的设备是无法进行自动化管理的，所以此时此方法无效。
>
> ```js
> MHPluginSDK.openIftttAutoPage();
> ```

#### *openNewMorePage* `AL-[119,)`

> 打开更多设置页面(包括安全设置等设置)
>
> **注意** 分享过来的设备是无法进行安全设置的，所以此时此方法无效。
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

> 存储信息
>
> 注意：componentId需要向米家后台申请，不用用未申请的componentId，破坏其他插件的数据
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

#### *onShare*  pre-release

> 全屏截图并分享到社交媒体
>
> MHPluginSDK.onShare();
>
> 
>


#### *openPrivacyPage*  pre-release

> 打开隐私协议弹窗
>
> MHPluginSDK.openPrivacyPage("deviceName","detail of policy")
