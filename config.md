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
>插件结构版本（当前2.x的SDK固定为1）

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


