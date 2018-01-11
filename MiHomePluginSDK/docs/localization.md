# 插件的多语言化

插件系统集成了第三方开源项目 [ReactLocalization](https://github.com/stefalda/ReactNativeLocalization) 来实现插件的多语言化，该库文件位于 CommonModules 文件夹中

```js
var LocalizedStrings = require("../CommonModules/LocalizedStrings");
```

**注意** 具体的使用请参照开源项目的[wiki](https://github.com/stefalda/ReactNativeLocalization)

## 米家的多语言化标准

米家APP要求插件支持四种语言：

1. 简体中文
2. 英文
3. 繁体中文（香港）
4. 繁体中文（台湾）

iOS9及以后的版本，系统的语言 key 包含了手机的地区信息，例如中国区－简体中文的语言 key 为 "zh-Hans-CN"，而香港区－简体中文的语言 key 为 "zh-Hans-HK"，我们对此作了修改，返回给插件的语言设置去掉了地区的信息，这样，只需要支持 "en"、"zh-Hans"、"zh-Hant"、"zh-HK"、"zh-TW" 5 个 key 即可。`AL-[100,)`

```js
"en":{
},
"zh-Hans":{ 
  //简体中文
},
"zh-Hant":{
  //繁体中文
},
"zh-HK":{
  //繁体中文（香港）
},
"zh-TW":{
  //繁体中文（台湾）
},
"es": {
  //西班牙语
},
"ru": {
  //俄语
},
"ko":{
  //韩语，暂不做要求，请根据自身产品需求决定是否支持
}

```
### 常量

```javascript
var ReactLocalization = require("NativeModules").ReactLocalization;
console.warn(""constants:" + ReactLocalization.systemLanguage+"\n");
```



> language  米家中设置的语言
>
> systemLanguage 系统语言

###方法

- getLanguage(callback)  `AL-[123,)`

  ```javascript
  var ReactLocalization = require("NativeModules").ReactLocalization;

  ReactLocalization.getLanguage((error, currentLanguage, systemLanguage) => {
    //error:是否出错
    //currentLanguage: 米家app内用户设置的语言，字符串
    //systemLanguage: 系统的当前语言字符串
    if(!error){
      console.warn("currentLanguage:" + currentLanguage +"\n" + "systemLanguage:" + systemLanguage + "\n"+"constants:" + ReactLocalization.systemLanguage+"\n");
    }
  })
  ```

  ​



