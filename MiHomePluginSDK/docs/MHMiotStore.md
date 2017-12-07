# MiHomePlugin API参考文档
## MHMiotStore模块 `AL-[110,)`

插件通过 MHMiotStore调起商城相关方法。

**目前只支持米家商城。**

```js
// 模块初始化
var MHMiotStore = require('NativeModules').MHMiotStore;
```

### 常量
无

### API

#### *openURL(url, callback)*  `AL-[113,)`

描述：打开商城某页面, 低于113的app会存在阻塞现象

参数：

* `url` 需要打开商城的页面的地址 String
* `callback(error)` 当接口访问失败的时候调用此回调

例子：

```javascript
MHMiotStore.openURL('http://home.mi.com/shop/detail?gid=100260', (error) => {
  if(error)
    MHPluginSDK.showFailedTips('打开失败');
});
```

