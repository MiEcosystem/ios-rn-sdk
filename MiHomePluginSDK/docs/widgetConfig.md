# MiHomePlugin API参考文档
## widgetconfig 配置项的含义

插件配置widget总共分两步，
* 填写配置文件plist
* 准备icon图片

### config.plist填写
widget的配置在插件配置中填写，插件配置文件config.plist中添加一个key, widget，类型为dictionary，widget dictionary在config.plist中具体结构如下；

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>pluginStructureVersion</key>
	<integer>1</integer>
	<key>noFrameworkCode</key>
	<true/>
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
	<key>widget</key>
	<dict>
		<key>deviceImage</key>
		<string>demo_operation_device_icon</string>
		<key>contents</key>
		<array>
			<dict>
				<key>localizablename</key>
				<dict>
					<key>en</key>
					<string>open</string>
					<key>zh_HK</key>
					<string>打開</string>
					<key>zh_TW</key>
					<string>打開</string>
					<key>zh_CN</key>
					<string>打开</string>
				</dict>
				<key>name</key>
				<string>widget.operation.icon.ondemo</string>
				<key>iconurl</key>
				<string>demo_operation_icon_auto</string>
				<key>method</key>
				<string>set_power</string>
				<key>params</key>
				<string>on</string>
			</dict>
			<dict>
				<key>name</key>
				<string>widget.operation.icon.off</string>
				<key>iconurl</key>
				<string>demo_operation_icon_love</string>
				<key>method</key>
				<string>set_power</string>
				<key>params</key>
				<string>off</string>
			</dict>
		</array>
	</dict>
</dict>
</plist>
```
可以用xcode打开com.xiaomi.demoios中的config.plist参考(温馨提示，可以拖拽demo中config.plist中的widget字段到自己的config.plist中，修改一下就可以了)

deviceImage为设备图标的文件名，contents为widget支持的操作数组，每一项的dictionary结构如下

```xml
<dict>
  <key>localizablename</key>
  <dict>
    <key>en</key>
    <string>open</string>
    <key>zh_HK</key>
    <string>打開</string>
    <key>zh_TW</key>
    <string>打開</string>
    <key>zh_CN</key>
    <string>打开</string>
  </dict>
  <key>name</key>
  <string>widget.operation.icon.ondemo</string>
  <key>iconurl</key>
  <string>demo_operation_icon_auto</string>
  <key>method</key>
  <string>set_power</string>
  <key>params</key>
  <string>on</string>
</dict>
```
name和localizablename都是widget操作的名字，例如“打开”“关闭”“最爱”等，name中填写多语言字符串的key，app支持的多语言字符串key可以查询localizable.strings中搜widget关键字，如果app没有提供，自己在localizablename字典中支持四种语言的名字

iconurl为widget操作的图片名，以上图片名均填写文件名即可，不用管路径

最后且最实质的一步配置，是rpc命令的方法名和参数，method为调用的rpc方法名，params为方法的参数，如果有多个参数则用","分隔

### 准备icon图片

widget图片都放在插件包的Resources/widget目录下，deviceImage只需准备@2x/@3x两张图片，文件名为对应字段的文件名；iconurl则需要三份图片，@2x/@3x共六张图片，对应iconurl字段的文件名、iconurl_closed、iconurl_open三份图片，展示在设备不同在线情况下

同样参考一下com.xiaomi.demoios中的图片命名和图片大小


大功告成，打包测试吧


