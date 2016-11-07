# 使用 MHJSPatch 辅助开发插件 (Experimental)

## 什么是JSPatch

[JSPatch](http://jspatch.com) 是一个开源项目，可以使用 JavaScript 调用任何 Objective-C 的原生接口，替换任意 Objective-C 原生方法。目前主要用于下发 JS 脚本替换原生 Objective-C 代码，实时修复线上 bug。

## 为什么要在插件开发过程中引入 JSPatch

由于 React Native 框架的限制，调用系统原生 API 有很大的不便，需要使用 Native 代码进行相关 API 的封装，插件无法自行完成。

**为此，我们将 [JSPatch](http://jspatch.com) 框架的部分特性引入到 React Native 开发框架之中，使得插件可以自由调用 iOS 的原生 API，从而实现较为复杂的界面或功能。**

## MHJSPatch 模块 `AL-[100,)`

```js
var MHJSPatch = require('NativeModules').MHJSPatch;
```

#### *evaluateScriptName(scriptName)*
>执行指定名称的 JSPatch 脚本
>
>`scriptName` 脚本名称
>`callback` 回调方法 **(id result)**
>
>插件的 JSPatch 脚本统一存储在插件的 JSPatch 目录下，此方法的 callback 可以获得脚本的返回值。（脚本最后一行代码的返回值）
>**注意** 若脚本的返回值不是简单类型（如返回了对象引用），React Native 并不能识别，因此返回值将没有作用。
>
>```js
// 执行插件目录 /JSPatch/demo.js 脚本
MHJSPatch.evaluateScriptName("demo.js", (result) => {
  console.log(result);
});
```

#### *evaluateScriptNameWithParams(scriptName, nameSpace, params)* `AL-[102,)`
>执行指定名称的 JSPatch 脚本，带参数
>
>`scriptName` 脚本名称
>`nameSpace` 参数的命名空间
>`params` 参数字典
>`callback` 回调方法 **(id result)**
>
>插件的 JSPatch 脚本统一存储在插件的 JSPatch 目录下，此方法的 callback 可以获得脚本的返回值。（脚本最后一行代码的返回值）
>**注意** 若脚本的返回值不是简单类型（如返回了对象引用），React Native 并不能识别，因此返回值将没有作用。
>
>```js
// 执行插件目录 /JSPatch/demo.js 脚本
MHJSPatch.evaluateScriptNameWithParams("demo.js", "demoNameSpace", {'content': 'This is a demo.'}, (result) => {
  console.log(result); // This is a demo.Done!
});
```
>
>```js
// demo脚本内容
var params = __demoNameSpace_params().toJS(); // 获取传进来的参数
var result = params.content + "Done!";
result; // 返回值
```

## JSPatch 脚本 API

除了 JSPatch 文档中提供的语法和 API 之外，插件系统提供了一些在 JSPatch 脚本中可以使用的新的 API 来简化插件的开发。

#### *gDevice()* `AL-[101,)`
>返回当前插件的设备对象
>
>```js
gDevice.name().toJS(); // 设备名称
gDevice.model().toJS(); // 设备 model
gDevice.isOnline(); // 设备是否在线
```

#### *gDeviceViewController()* `AL-[101,)`
>返回当前插件的父ViewController

#### *gBasePath()* `AL-[101,)`
>返回当前插件的资源目录路径，相当于 MHPluginSDK.basePath
>
>```js
require("MHImageView");
var imageView = MHImageView.alloc().initWithFrame({x:0,y:0,width:100,height:100});
imageView.setImageUrl(gBasePath+"abc.png");
imageView.loadImage();
```

#### *definePage(pageDeclaration, insMethods, classMethods)*
>定义一个新的页面
>
>**注意** 虽然 JSPatch 提供了通过 defineClass 修改原生类实现的能力，但由于安全的考虑，MHJSPatch 并不支持 defineClass 方法，而是相应的提供了 definePage 方法用于定义一个新的页面类。
>
>该方法与defineClass类似，只是定义的类统一继承MHPViewController，在pageDeclaration中不需要再指明基类

#### *pushNewPage(pageObj)*
>打开一个新的页面
>
>新的页面可以是 definePage 方法定义的页面类的实例。
>
>```js
>require('NSNotificationCenter,UILabel,UIFont,UITextView,NSString');
definePage('JPDemoViewController', {
  viewDidLoad: function() {
    self.super().viewDidLoad();
    self.setTitle("JSPatch Demo Page");
    self.setIsTabBarHidden(YES);
    self.setIsNavBarTranslucent(YES);
  },
  // MHViewController 的方法 
  buildSubviews: function() {
    var topMargin = 100;
    var bounds = self.view().bounds();
    _regLabel = UILabel.alloc().initWithFrame(CGRectMake(10, topMargin + 10, CGRectGetWidth(bounds) - 20, 20));
    _regLabel.setFont(UIFont.systemFontOfSize(18));
    _regLabel.setText("Label");
    self.view().addSubview(_regLabel);
    _regLabel.sizeToFit();
  },
});
// push 页面
var testViewController = JPDemoViewController.alloc().init();
pushNewPage(testViewController);
```

#### *callMethod(device, method, params, extraInfo, callback)*
>调用设备的RPC接口，类似 MHPluginSDK.callMethod 方法。
>
>`device` 设备对象，传 gDevice 即可。
>`method` 方法命令字
>`params` 参数数组
>`extraInfo` 附加信息
>`callback` 回调方法 **(BOOL isSuccess, Object response)**
>
>```js
// 打开设备
callMethod(gDevice, "set_power", ["on"], {}, function(isSuccess, response) {
  _OC_log(response);
}); 
```

#### *callSmartHomeAPI(api, params, callback)*
>调用米家云端接口，类似 MHPluginSDK.callSmartHomeAPI 方法。
>
>`api` 云端接口命令字
>`params` 参数数组或字典
>`callback` 回调方法 **(Object response)**
>
>```js
var TimerQuestData = {
  "did": gDevice.did().toJS(),
  "st_id": "8",
  "identify": gDevice.did().toJS(),
}
// 获取定时列表
callSmartHomeAPI("/scene/list",TimerQuestData,function(response) {
  _OC_log(response);
});
```

## MHPViewController 类参考

definePage 方法定义的页面，基类为 MHViewController ，代表了一个最基本的页面。

### 属性

#### *isTabBarHidden* 
>TabBar 是否隐藏，默认为 YES，隐藏。
>
>`BOOL`

#### *isNavBarHidden*
>NavigationBar 是否隐藏，默认为 NO，不隐藏。
>
>`BOOL`

#### *isNavBarTranslucent*
>NavigationBar 是否透明，默认为 NO，不透明。
>
>`BOOL`

#### *attributedTitle*
>带属性的 title 字符串
>
>`NSAttributedString *`

### 方法

#### *refreshTitle*
>更新页面标题

#### *applicationDidEnterBackground*
>程序切后台回调，插件可复写此方法。

#### *applicationWillEnterForeground*
>程序切前台回调，插件可复写此方法。

#### *(BOOL)isNeedBackButton*
>页面左上是否有返回按钮，插件复写此方法，默认返回 YES

