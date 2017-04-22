#  使用chrome辅助调试插件代码

- rn的调试菜单在release模式下禁用了，所以用App Store版本无法调试，需要使用debug版本的米家app，可以通过联系米家工作人员获得
- 在开发者模式设置好配置，如下图
  <img src="img/IMG_3716.PNG" width="200" />
- 在个人页设置中打开rn调试功能，“开发者通用设置”=>"插件调试"
  <img src="img/IMG_3767.PNG" width="200" />
  <img src="img/IMG_3768.PNG" width="200" />
- 打开rn调试后，进入插件页，会自动打开Mac上的chrome一个网页
  <img src="img/chrome.PNG" />
- 打开chrome开发者模式（Mac上是**Command**`⌘` + **Option**`⌥` + **I**）即可进行调试，具体可以参照rn文档
- 准备工作就绪，进入插件页，可以在chrome中看到log
  <img src="img/log.PNG" />

  或者加断点进行调试
  <img src="img/breakpoint.PNG" />