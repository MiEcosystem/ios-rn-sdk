## React Native 插件的生命周期


由于整个 React Native 插件（应用）由各类型的 Components（组件） 组成，当我们讨论 React Native 插件的生命周期时，讨论得即是 Component 的生命周期及其管理。

本文没有提及之处，则皆以 React 的 [官方文档](https://facebook.github.io/react/docs/react-component.html) 为准。

#### Component 生命周期

大致可以分为三个部分：

- 挂载（Mounting）
- 更新（Updating）
- 卸载（Unmounting）

**挂载期**，即 Component 初始化并被插入虚拟DOM中时，以下方法会被触发：

- `constructor(){}`

Component 的构造函数，此处可用来初始化 state 模型。

- `componentwillMount(){}`

表示 Component 将要加载到虚拟DOM，在  render() 方法之前执行，可以用来做一些加载前的准备工作。不建议在此处做网络请求或者蓝牙连接，原因是不能保证请求仅在 Component 加载完毕后才会要求响应，如果网络请求在 Component 加载之前就完成，并且调用了 setState 函数将数据添加到 Component 状态中，则会出错。推荐将网络请求放在 `componentDidMount()` 中执行。更多讨论参考[此处](https://stackoverflow.com/questions/41612200/in-react-js-should-i-make-my-initial-network-request-in-componentwillmount-or-co)。

- `componentDidMount(){}`

Component 已加载到虚拟DOM中。

**更新期，或者称为运行期**，以下方法会被触发：

- `componentWillReceiveProps(){}`

在 Component 收到其父组件传递的 `props` 时执行，在整个生命周期可以执行多次。

- `shouldComponentUpdate(){}`

在`componentWillReceiveProps()`执行之后立刻执行；或者在 `state` 更改之后立刻执行。该方法包含两个参数，分别是 `props` 和 `state` 。在组件的整个生命周期可以多次执行。如果该方法返回`false`，则`componentWillUpdate() `及其之后方法都不会执行，组件不会进行重新渲染。

- `render(){}`

组件渲染，在挂载期和更新期均会执行。

**卸载期**，只有一个方法：

- `componentWillUnmount(){}`

Component 将要卸载时调用，可以在此处做一些清理工作。**此处有一处特殊情况需要注意，**即调用`MHPluginSDK.closeCurrentPage()`退出插件时，插件组件会被强制卸载，该方法中的操作可能来不及执行。该种情形通常出现在插件的首页（第一页），用户点击返回按钮时，调用 `closeCurrentPage()`，首页中该方法中的操作未全部执行。故，监听插件的退出，清理工作需要在  `closeCurrentPage()`之前进行，不要写在该方法中。

#### 监听插件启动

如需监听插件的启动，可监听首个 Component 的挂载，即 `AppRegistry.registerComponent()` 注册的  Component 的挂载。在其触发的方法中做你需要的操作，比如：在 `componentDidMount(){}` 中进行设备数据的拉取。

如果需要判断该插件是否是第一次被启动，可利用SDK提供的存储能力写一个 flag 来判断：进入插件后，尝试获取某个 key 的值，返回为空则为第一次启动，并写入值，后续再进入插件尝试获取该 key 的值，返回不为空则不为第一次启动。

举个例子：

```javascript
var MHPluginFS = require('NativeModules').MHPluginFS;
MHPluginFS.readFile("isNew", (success,res)=>{
  if(res){
    console.log("not the first");
    return;
  }
  //this is the first time!
  MHPluginFS.writeFile("isNew", "some content", (success,res)=>{});
}));
```

具体来说：

[`MHPluginFS`](https://github.com/MiEcosystem/ios-rn-sdk/blob/master/MHPluginFS.md) 模块是根据设备 Model 来存储，相同model 的不同设备以及同一设备的不同插件版本共享同一片存储空间，可用来判断某一类设备(相同 model )是否是第一次启动。同时可在存储时加入用户的uid、插件版本号等等，来判断不同用户、版本的首次启动。

`MHPluginSDK.saveInfo` 方法是根据设备 did 来存储，可用来判断某一个设备是否是第一次被打开。

注意上面两个方法都是本地存储，用户删除米家 app 后会导致数据被删除，重装 app 后，则用户会被认为是第一次启动，同时用户使用不同的手机也会遭遇同问题。如果有跨设备的强需求，可利用云端的存储能力，相同的逻辑，将 flag 写在云端。

`MHPluginSDK.setUserConfigs` 与 `MHPluginSDK.getUserConfigs` 可向云端存取数据，云端根据厂商分配的 appid + uid 存取，可跨设备判断某一用户是否是第一次启动该插件。

#### 监听插件退出

参考上文 `componentWillUnmount(){}` 方法中的描述，注意  `closeCurrentPage()` 是直接退出插件。