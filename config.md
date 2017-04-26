# MiHomePlugin API参考文档
## config.plist 配置项的含义

config.plist 文件位于插件包目录下，是个 XML 格式的 plist 文件，用于配置一些插件的整体行为。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>pluginStructureVersion</key>
        <integer>1</integer>
        <key>deviceStatusRefreshInterval</key>
        <integer>6</integer>
        <key>customSceneTriggerIds</key>
        <array>
                <string>250</string>
        </array>
        <key>customSceneActionIds</key>
        <array>
                <string>250</string>
        </array>
</dict>
</plist>
```

#### *pluginStructureVersion*
>插件结构版本（当前2.x的SDK固定为2）

#### *deviceStatusRefreshInterval*
>插件页设备状态轮询间隔。
>
>Int
>
>单位为秒。不设置默认为6秒，有效设置范围为1-60。

#### *customSceneTriggerIds*
>插件支持的自定义场景触发条件sc_id数组
>
>Array \<String\>
>
>参见“开发自定义智能场景”章节

#### *customSceneActionIds*
>插件支持的自定义场景动作sa_id数组
>
>Array \<String\>
>
>参见“开发自定义智能场景”章节

#### *bleScanIsNeedDelegate*

> 蓝牙插件快联是否需要被代理扫描蓝牙设备
>
> Boolean 

#### *pluginFetchPropStatusMode*

> 获取属性变化的监听方式
> integer<!-- 0 polling, 1 subscribe, 2 not get-->
>
> 0 轮询方式，设备需在1秒内给出返回，否则超时错误
>
> 1 订阅方式，通过mipush实现，前提是设备需把属性值上报后台
>
> 2 不获取，则调用相关注册函数被忽略，不获取属性值