# 插件页面和组件代码说明

## index.ios.js 代码说明

与普通的 RN 应用相同，插件的 js 入口也是 index.ios.js (其中的 PluginApp)，整个插件的页面导航使用 Navigator 组件，导航栏 Component 为 CommonModules 目录下的 MHNavigationBar。

根据启动插件时携带的 MHPluginSDK.extraInfo 中是否包含自定义场景的 trigger/action 信息，PluginApp 会选择启动自定义场景页组件 SceneMain 还是插件主页面组件 MainPage。

PluginApp 对象提供了一些方法来完成一些全局性的功能，各个页面 component 可以通过 this.props.app 来获取到 PluginApp 的引用并调用其上的方法：

#### *pathForResource(filename)*
> 获取插件包内资源的路径

#### *sourceOfImage(filename)*
> 获取插件包内图片的 source，通常是给 Image 组件使用
>
> ```js
<Image style={styles.iconDemo} source={this.props.app.sourceOfImage("control_home.png")} />
```
> **注意** React Native的require方式获取图片只支持常量字符串，不能采用字符串拼接的方式，如果要用require方式获取图片，不能用以上方法，而要用类似如下的代码：
> 
> ```js
var icon = MHPluginSDK.devMode ? require('../Resources/xxx.png') : require('./xxx.png');
<ImageButton source={icon} ...>
```

#### *setIsNavigationBarHidden(isHidden)*
> 设置导航栏是否隐藏
> 
> 每个页面组件都有 route 对象来管理自己页面的导航栏属性，这个方法只当导航栏需要动态改变时调用

#### *setNavigationBarStyle(barStyle)*
> 设置导航栏背景样式
> 
> 每个页面组件都有 route 对象来管理自己页面的导航栏属性，这个方法只当导航栏需要动态改变时调用

## Component 代码说明

插件中每一个页面 component 都是一个单独的js文件，与 RN 的 Component 基本一致，只是在 export 的时候，除了 export 组件以外，还要 export 一个 route 对象，用来设置一些页面的属性，包括标题、导航栏样式等。

```js
module.exports = {
  component: MainPage,
  route: route,
}
```

```js
const KEY_OF_MAINPAGE = 'MainPage';
var route = {
  key: KEY_OF_MAINPAGE,
  title: MHPluginSDK.deviceName,
  component: MainPage,
  navLeftButtonStyle: {
    tintColor:'#ffffff',
  },
  navTitleStyle: {
    color:'#ffffff',
  },
  navBarStyle: {
    backgroundColor:'transparent',
  },
  isNavigationBarHidden: false,
  renderNavRightComponent: function(route, navigator, index, navState) {
    if (MHPluginSDK.userId == MHPluginSDK.ownerId) // 非分享设备
    {
      return (
        <View style={{left:0, width:29+15*2, height:APPBAR_HEIGHT, justifyContent:'center', alignItems:'center'}}>
          <ImageButton
            source={{uri:MHPluginSDK.uriNaviMoreButtonImage, scale:PixelRatio.get()}}
            onPress={() => {
              openMorePage(navigator);
            }}
            style={[{width:29, height:29, tintColor: '#ffffff'}]}
          />
        </View>
      );
    }
    else {
      return null;
    }
  },
}
```


 

