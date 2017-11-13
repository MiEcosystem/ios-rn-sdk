
MHMapLocation 模块主要提供插件与native端的高德地图的AMapLocationKit交互的接口，配合MHMapView使用，可以在插件端实现高德地图的多种功能。

```
// 模块初始化
var MHMapLocation = require('NativeModules').MHMapLocation;
```
#### *reLocationWithReGeocode*  （pre-release）
>
> /**
> 
>重新定位
>
> @param withReGeocode 是否带有反地理信息
> 
> @param callback: 
> >location: 返回一个包含经度和纬度的字典
> >
> >regecode: 反地理信息，比如国家，区域，街道等
> >
> >error: 错误信息，参见NSError定义
> >
>
>  */
 
  
  ```
      MHMapLocation.reLocationWithReGeocode(false,(location,regeocode,error) => {
        console.log("🔴location");
        console.log(location);
        console.log("🔴regeocode");
        console.log(regeocode);
        console.log("🔴error");
        console.log(error);
      })
      
  ```
  