# MiHomePlugin API参考文档
## MHPluginSDK模块 `AL-[100,)`

MHPluginSDK 模块主要提供插件与小米智能家庭主APP、智能设备，以及智能家庭云端交互的API。包括获取设备信息、设置设备属性、向设备发送指令、访问智能家庭云端接口、访问特定UI资源等等。

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

#### *apiLevel*
>当前智能家庭 APP 的 API_Level
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

### 可以在插件端监听的事件
#### *deviceStatusUpdatedEventName*
>设备状态更新
>
>在插件运行在前台时，智能家庭APP会定期（默认每 6s 一次，可通过 config.plist 中的配置项进行调整）向设备发送 get_props 请求来获取设备指定属性集合的最新状态。之后插件会接收到本事件，触发事件回调。
>
>插件可以在该事件回调中进行相应的 state 设置，从而触发界面更新，来展示设备的最新状态。
>
>```js
componentDidMount: function() {
  // 指定发送 get_props 获取的属性集合
  MHPluginSDK.registerDeviceStatusProps(["rgb"]);
  // 订阅定期状态轮询的通知
  var {DeviceEventEmitter} = require('react-native');
  var subscription = DeviceEventEmitter.addListener(MHPluginSDK.deviceStatusUpdatedEventName,(notification) => {
    // 从device属性的内存缓存中拿到轮询的状态结果
    MHPluginSDK.getDevicePropertyFromMemCache(["rgb"], (props) => {
      if (props.rgb)
      {
        var sRGB = "#" + this.getNewRGB(props.rgb >> 16, (props.rgb >> 8) & 0x00ff, (props.rgb & 0x0000ff));
        // 设置 state 刷新页面
        this.setState({"resultViewColor":sRGB});
      }
    });
  });
},
```

#### *onReceivingForegroundPushEventName*
>插件在前台时收到 APNS 推送
>
>智能家庭APP在后台时，收到苹果的 APNS 推送，用户点击推送会启动智能家庭 APP，并转到相应推送设备的插件首页，此时 MHPluginSDK.extraInfo 里包含了推送的相关参数。
>
>智能家庭APP在前台时，收到苹果的 APNS 推送，如果此时相关设备插件未启动，则会弹出一个 Alert 提示用户转到相应的插件，携带参数同上。
>
>智能家庭APP在前台时，收到苹果的 APNS 推送，如果此时相关设备插件正在展示，则不再弹出 Alert，插件会收到本通知，并触发通知的事件回调，携带参数在通知回调中给出。

```js
  var {DeviceEventEmitter} = require('react-native');
  var subscription = DeviceEventEmitter.addListener(MHPluginSDK.onReceivingForegroundPushEventName,(notification) => {
    // 插件在前台收到push通知回调
    console.log(JSON.stringify(notification));
  });
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
  // 假设灯的 profile 中有 power/brightness/color 几个属性
  MHPluginSDK.registerDeviceStatusProps(["power", "brightness", "color"]); 
  // APP会在插件运行时每6s获取一次灯的电源开关状态、亮度以及颜色值，插件通过监听 MHPluginSDK.deviceStatusUpdatedEventName 来处理回调。
```

#### *callMethod(method, params, extrainfo, callback)*
>调用设备 RPC 指令接口
>
>`method` 方法命令字字符串
>`params` 方法参数数组
>`extraInfo` 附加信息字典
>`callback` 回调方法 **(BOOL isSuccess, Object response)**
>
>智能家庭APP会根据当时设备的情况选择是通过云端下发指令给设备，还是直接通过局域网向设备发送指令。设备接收的指令集请查阅该设备的 profile
>**注意** 此接口只适用于 WIFI 设备，蓝牙设备的控制请参见 MHBluetooth 文档
>
>```js
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

#### *callSmartHomeAPI(api, params, callback)*
>调用智能家庭云端 API
>
>`api` 云端提供的 API 接口命令字字符串
>`params` 参数字典或数组（视具体 API 而定）
>`callback` 回调方法 **(Object response)**
>
>具体不同设备开放的云端接口请参照智能家庭云端文档或咨询智能家庭后台。
>
>支持的部分云端 API：
>`/scene/list` 获取设备定时列表
>`/scene/delete` 删除设备定时
>`/scene/edit` 创建（编辑）设备定时
>`/home/latest_version` {"model": model} 获取最新固件版本（蓝牙设备）
>`/home/checkversion` {"pid":0, "did":did} 获取最新固件版本（WIFI设备）
>
>```js
>// 获取当前设备固件版本
MHPluginSDK.getDevicePropertyFromMemCache(["version"], (props) => {
  console.log("current version"+props.version);
});
// 获取最新固件版本（蓝牙设备）
MHPluginSDK.callSmartHomeAPI("/home/latest_version", {"model":MHPluginSDK.deviceModel}, (response) => {
  console.log("latest version"+JSON.stringify(response));
});
// 获取最新固件版本（WIFI设备）
// pid 固定为0
MHPluginSDK.callSmartHomeAPI("/home/checkversion", {"pid":0, "did":MHPluginSDK.deviceId}, (response) => {
  console.log("latest version"+JSON.stringify(response));
});
```
>
>```js
// 删除已经设置的定时
MHPluginSDK.callSmartHomeAPI('/scene/delete', delDate, (response) => {
  AlertIOS.alert(JSON.stringify(response));
});
```

#### *callThirdPartyAPI(serverAppId, dids, params, callback)* 
>异步调用第三方对接小米智能家庭云端的 API
>
>`serverAppId` 小米智能家庭云端分配的 appId
>`dids` 设备 id 数组（可为空，若不为空则后台会对数组中的设备做校验）
>`params` 参数字典
>`callback` 回调方法 **(Int errorCode, Object response)**
>
>插件原则上不允许直接访问非小米智能家庭后台的 API，如需访问第三方服务器（例如插件公司自己的服务器）的 API 必须通过小米智能家庭后台中转。第三方对接小米智能家庭云端的 API 将以异步的方式调用，细节对客户端透明，详细的服务器对接过程请与小米智能家庭后台联系。
>
>```js
MHPluginSDK.callThirdPartyAPI("1001", [], {"api":"testAPI"}, (errorCode, response) => {
  AlertIOS.alert(JSON.stringify(response));
});
```

#### *updateDeviceInfoCallback(callback)* `AL-[107,)`
>向云端请求一次当前设备的信息，其中包含了当前设备是否在线
>
>`callback` 回调方法 **(Object response)**
>
>可以用这个请求来查询设备是否在线，但是请求间隔不能小于20s，否则可能会被智能家庭服务器打击；**设备在线状态建议采用客户端计时，状态轮询几次无结果时认为设备已离线，一般无须用这个请求实现。**

#### *postHTTP(url, params, callback)*
>普通的 HTTP POST 请求，要求 response 为 JSON
>
>`url` 请求网址
>`params` 参数字典
>`callback` 回调方法 **(Object response)**

#### *getHTTP(url, params, callback)*
>普通的 HTTP GET 请求，要求 response 为 JSON
>
>`url` 请求网址
>`params` 参数字典
>`callback` 回调方法 **(Object response)**

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
>```js
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
componentDidMount: function() {
  // 指定发送 get_props 获取的属性集合
  MHPluginSDK.registerDeviceStatusProps(["rgb"]);
  // 订阅定期状态轮询的通知
  var {DeviceEventEmitter} = require('react-native');
  var subscription = DeviceEventEmitter.addListener(MHPluginSDK.deviceStatusUpdatedEventName,(notification) => {
    // 从device属性的内存缓存中拿到轮询的状态结果
    MHPluginSDK.getDevicePropertyFromMemCache(["rgb"], (props) => {
      if (props.rgb)
      {
        var sRGB = "#" + this.getNewRGB(props.rgb >> 16, (props.rgb >> 8) & 0x00ff, (props.rgb & 0x0000ff));
        // 设置 state 刷新页面
        this.setState({"resultViewColor":sRGB});
      }
    });
  });
},
```

#### *setDevicePropertyToMemCache(kvPairs)*
>向内存缓存中设置设备属性键值（不会发送网络请求）
>
>`kvPairs` 属性 key-value 字典
>
>**注意** 此方法并不会发送 RPC 指令给设备来设置状态，只是修改当前 APP 内存缓存中存储的对应属性值，可设置/获取的设备属性并不需要在设备的 profile 中，可以是任何合法的 key，实际上可以看作一片 key-value pair 形式存储的内存缓存，在退出插件时会被清空。
>
>想要发送 RPC 指令给设备获取最新状态，请用 *callMethod(method, params, extraInfo, callback)* 方法
>
>```js
// 可以看做是一片内存缓存，能存储任何值，通常是设备相关的属性。
MHPluginSDK.setDevicePropertyToMemCache({"power":"on", "abc":"def"});
```

#### *openAddDeviceGroupPage*
> 打开创建设备组页
>
>**注意** 只有特定设备支持创建设备组统一管理，此方法目前只支持特定设备，使用请与智能家庭联系。

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

#### *openTimerSettingPageWithVariousTypeParams(onMethod, onParam, offMethod, offParam)* `AL-[101,)`
>提供设备定时设置的统一页面，用来让用户设置设备的定时开关。
>
>`onMethod` 定时到时设备“开”执行的 RPC 指令命令字字符串
>`onParam` 定时到时设备“开”执行的 RPC 指令参数，可以是字符串、数字、字典、数组
>`offMethod` 定时到时设备“关”执行的 RPC 指令命令字字符串
>`offParam` 定时到时设备“关”执行的 RPC 指令参数，可以是字符串、数字、字典、数组
>
>```js
MHPluginSDK.openTimerSettingPageWithVariousTypeParams(
"set_power", ['on', 'smooth', 500], 
"set_power", ['off', 'smooth', 500]);
>```
>如果只有“开”或者“关”，只需要把用不到的参数置为null。
>
>```js
MHPluginSDK.openTimerSettingPageWithVariousTypeParams(
null, null, 
"set_power", ['off', 'smooth', 500]);//只有关
>```
>**注意** 可以把不需要的参数置为null，但是不可以不写。

#### *openDeviceUpgradePage*
> 打开设备固件升级页面
>
>**注意** 分享过来的设备是无法进行固件升级的，所以此时此方法无效。
>
>```js
>MHPluginSDK.openDeviceUpgradePage();
```

#### *closeCurrentPage*
>退出插件
>
>**注意** 如果在插件设置页，则会退出设置页。

#### *showFinishTips(content)*
>显示一个已完成提示，时长1秒
>
>```js
MHPluginSDK.showFinishTips("数据获取成功！");
```

#### *showFailTips(content)*
>显示一个失败的提示，时长1s
>
>```js
MHPluginSDK.showFailTips("数据获取失败！");
```

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
>```js
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
MHPluginSDK.loadDeviceCurrentPlaceMarkCallback((placeMark, loopbackParams) => {
  console.log(plackMark);
});
```

#### *addRecord(type, value, extra)*
> 添加插件自定义统计事件点
> 
> `type` 自定义事件类型字符串
> `value` 自定义值字典
> `extra` 附加字典，一般传空{}
>
>```js
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
MHPluginSDK.openShareListBar("小米智能家庭开放平台", "小米智能火箭筒专卖", MHPluginSDK.basePath+"rockets.png", "http://open.home.mi.com");
```

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

#### *finishCustomSceneSetup(payload)*
>完成场景设置，回传设置后的 payload</b>
>
>`payload` 设置后的自定义场景payload
>
>**注意** 此方法只在开发自定义智能场景插件 bundle 时使用，作用是插件自定义场景处理完成时将处理好的 payload 回传，请参见”开发自定义智能场景“章节


