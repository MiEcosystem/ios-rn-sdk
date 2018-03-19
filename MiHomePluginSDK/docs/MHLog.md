# MHLog 统计日志模块参考文档

MHLog 模块提供扩展程序内的日志打点、统计打点（内测中）功能。



#### 模块初始化

```javascript
const MHLog = require('NativeModules').MHLog;
```



#### *addLog(tag, info)*  `AL-[134,)`

描述：添加一条日志打点。开发者应该在拓展程序内合适时机调用该接口，打点信息会自动写入文件，按 Model 归类，即一个 Model 生成一个日志文件。当用户反馈问题时，勾选 “同时上传日志”，则该 Model 的日志会跟随用户反馈上传，开发者可在 IoT 平台查看用户反馈及下载对应日志文件。

注意：每个 Model 的日志限制为：48小时内且文件大小不能超过 20M。超过此条件，旧日志会自动清理。

参数：

- `tag` String 类型
- `info` Sting 类型

例子：

```javascript
MHLog.addLog("plugin_tracker", "didMount");
```