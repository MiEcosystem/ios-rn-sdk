## config.plist 配置项的含义

config.plist 文件位于插件包目录下，是个 XML 格式的 plist 文件，用于配置一些插件的整体行为。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
        <key>pluginStructureVersion</key>
        <integer>2</integer>
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
  	 	<key>supportIPhoneX</key>
		<true/>
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


### 设置页面的配置项目

#### *onMoreMenuHideCustom*

> 作用：是否显示“功能设置”
>
> 类型：BOOL
>
> 不设置，或者设置为NO，根据设备是否是分享过来的，来决定是否隐藏。 
>
> 设置为YES，强制隐藏"功能设置"项目。
>
> 如果“功能设置“最终还是需要显示，请在插件中提供你自己设置的页面。


#### *onMoreMenuHideFeedback*

> “ 反馈 ”
>
>  类型： bool
>
>  设置为YES， 不显示"反馈"

#### *onMoreMenuHideDeleteDevice*

> “ 解除连接 ”
>
>  类型： bool
>
>  设置为YES， 不显示"解除连接"


#### *onMoreMenuHideUpgradeDevice*

> “ 检查固件升级”
>
>  类型： bool
>
>  设置为YES， 则不显示"检查固件升级"
>
>  要显示“检查固件升级”，需保证：设备不是共享的且不是虚拟设备

#### *onMoreMenuHideChangeDeviceName*

> “ 设备名称”
>
>  类型： bool
>
>  设置为YES， 则不显示"设备名称"
>
>  要显示“设备名称”，需保证：设备不是被分享过来的


#### *onMoreMenuHideShare*

> “ 设备共享”
>
>  类型： bool
>
>  设置为YES， 则不显示"设备共享"
>
>  要显示“设备共享”，需保证：设备不是被共享的过来的。

#### *supportIPhoneX*

> 是否适配 iPhoneX
>
> 类型：bool
>
> 假如你的插件适配了 iPhone X，请设置为 YES
>
> 否则不用添加该字段，或设置为 NO
### *isShowPrivacyItemsInSettingView*
>  类型：bool
> 
>  对于还在使用已被废弃的
>
>>MHPluginSDK.openNewSettingPage();
> 
>  来打开设置页的插件，如果想在插件设置页中查看授权的隐私协议。需要将isShowPrivacyItemsInSettingView设置为true，默认为false。
>
> __建议直接使用Demo 工程中的MHSetting.js__



