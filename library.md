# 使用 React Native 第三方开源组件

插件可以使用兼容 React Native 0.25.0 版本的第三方纯 js 开源组件，不能使用包含 Native 代码的组件。

**如果有特殊需求，请与米家工作人员联系**

## 米家 APP 中已经集成的组件

### react-native-camera
[react-native-camera](https://github.com/lwansbrough/react-native-camera) 相机界面，支持二维码扫描。插件可引用 CommonModules 下的 Camera.ios.js 并修改界面。

```js
var Camera = require("../CommonModules/Camera.ios");
```

**注意** 比原库多提供一个事件标志打开相机失败

```js
  var {DeviceEventEmitter} = require('react-native');
  var subscription = DeviceEventEmitter.addListener("RCTCameraSessionErrorEvent", (notification) => {
    // 相机打开失败，界面提示用户打开相机授权  
  });
  // 记得取消监听通知
```


### react-native-chart
[react-native-chart](https://github.com/onefold/react-native-chart) 绘制图表。

**注意** 这个库集成了两个版本，0.1.4（有native部分）

```js
var RNChart = require('react-native-chart');
```

以及1.0.7beta（纯js，例子参见开发板demo）`AL-[105,)`

```js
import 'Chart' from '../CommonModules/Chart/Chart.js'
```


### React-ART 
绘图、绘制自定义控件

```js
var ReactART = require('ReactNativeART');
var {
	Surface,
	Path,
	Group,
	Transform,
	Shape,
} = ReactART;
```

React-ART 的功能强大，可以完成各种自定义绘图的过程，SDK 的开发板 demo 插件中有简单使用的示例。更详细的使用教程请查阅相关资料。
​	
### MHCircularSlider
一个环形的滑块 slider 控件。

```js
var MHCircularSlider = require('../CommonModules/MHCircularSlider');
	
// ...
// 使用
render: function() {
  return (<MHCircularSlider style={styles.container} minimumValue={0} maximumValue={100} value={50} onUpdate={this._onUpdate.bind(this)} ref="sliderA" />);
},
	
_onUpdate: function(e) {
	var body = e.body;
	console.log("on Update: "+e.nativeEvent.value+" touchend:"+e.nativeEvent.touchEnded);
	//this.refs.abcd.setPower(true, 30); //设置按钮开关
	//this.refs.abcd.setValue(60); // 设置slider的值
	//this.refs.abcd.getValueWithCallback((value)=>{ // 获取slider当前值
	//  console.log("value:"+value);
	// });
},
```

### MHTableView 
由于 RN 提供的 ListView 控件在 cell 较多的时候会出现一些性能问题，这里提供一个 TableView 组件，能够对 Cell 做一些简单的定制，适合 UI 简单的情况。
​	
**cell 只包含一个左侧的图片区域、一个标题、一个副标题三个部分，支持 section**
​	
```js
var MHTableView = require('../CommonModules/MHTableView');
```

```js
<MHTableView refs={component=>this._tableView=component} hasIndex={true} onGetMore={this._onGetMore.bind(this)} onSelectRow={this._onSelectRow.bind(this)} />
```

```js
// MHTableView的DataSource示例
var dataSource = {
  "index" : {
    "foregroundColor":"#000000",
  },
  "sections":[
    // SectionA
    {
      "header": {
        "text": "Section标题",
        "height": 40,
        "backgroundColor": "#ff00ff",
        "foregroundColor": "#00ff00",
        "x": 20,
        "fontSize": 18,
        "fontIsBold": true,
        "extra": {
          "ignoreIndex": true,
          "separatorColor": "#228888",
          "separatorPadding": 40,
        },
      },
      // Cell Array
      "cells": [
        {
          "height":150,
          "backgroundColor":"#008888",
          "extra": {
            "separatorColor":"#444444",
            "separatorPadding": 20,
         },
 
         "title": {
           "text": "主标题",
           "foregroundColor": "#660000",
           "fontSize": 25,
         },
 
         "subTitle": {
           "text": "副标题",
         },
      
         "image": {
           "imageUri": "http://www.图片地址",
         },
       }
     ]
   };
```

```js
// 刷新列表
this._tableView.reloadData(dataSource);
```

### UIImagePickerManager
[UIImagePickerManager](https://github.com/marcshilling/react-native-image-picker) 通过原生相机和相册空间选择图片

```js
var UIImagePickerManager = require("NativeModules").UIImagePickerManager; // 旧版
var UIImagePickerManager = require("NativeModules").ImagePickerManager; // 新版
```

### gl-react-native `AL-[105,)`
[gl-react-native](https://github.com/ProjectSeptemberInc/gl-react-native) OPENGL组件，由于RN引擎版本的原因，集成的是2.27.0的版本

### react-native-orientation `AL-[106,)`
[react-native-orientation](https://github.com/yamill/react-native-orientation)
转屏组件，1.17.0，参见转屏demo

### react-native-video `AL-[106,)`
[react-native-video](https://github.com/brentvatne/react-native-video)
视频播放器，0.8.0，参见开发板demo中的VideoDemo

### react-native-svg `AL-[107,)`
[react-native-svg](https://github.com/magicismight/react-native-svg)
SVG组件，2.0.0，参见SVG组件应用Demo

### react-native-particle-system `AL-[107,)`
[react-native-particle-system](https://github.com/greghe/react-native-particle-system) 粒子系统。

```js
import 'ParticleCell' from '../CommonModules/ParitcleSystem/ParticleCell.js'
import 'ParticleView' from '../CommonModules/ParitcleSystem/ParticleView.js'



```

### react-native-webview-bridge `AL-[111,)`
[react-native-webview-bridge](https://github.com/alinz/react-native-webview-bridge) React Native Webview with Javascript Bridge