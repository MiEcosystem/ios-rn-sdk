# MiHomePlugin API参考文档
## MHMapSearch模块 `AL-[105,)`

MHMapSearch 模块主要提供插件与native端的高德地图的AMapSearchKit交互的接口，配合MHMapView使用，可以在插件端实现高德地图的多种功能。

**在插件中使用高德地图的完整例子，请参见开发板插件 com.xiaomi.demoios 中的 MHMapDemo.js**

```js
// 模块初始化
var MHMapSearch = require('NativeModules').MHMapSearch;
```

### 常量

### 可以在插件端监听的事件

### 资源 URI

### API
#### *reGeocodeSearch(coordinate, callback)*
>反地理编码
>
>`coordinate` 地理坐标
>`callback` 回调方法 **(BOOL isSuccess, Object json)**
>
>```js
>var coordinate = {
>```
	'latitude': 40.0000,
	'longitude': 110.0000,
}
MHMapSearch.reGeocodeSearch(coordinate, (isSuccess, json)=>{
 	if (isSuccess) {
   	console.log(json);
 	}
 	else {
   	alert('操作失败')
 	}
});
```

#### *poiAroundSearch(coordinate, keywords, callback)*
>poi周边查询
>
>`coordinate` 地理坐标
>`keywords` 关键字
>`callback` 回调方法 **(BOOL isSuccess, Array json)**
>
>```js
var coordinate = {
 	'latitude': this.latitude,
 	'longitude': this.longitude,
}
var keyword = '住宿';
MHMapSearch.poiAroundSearch(coordinate, keyword, (isSuccess, json)=>{
 	if (isSuccess) {
   	console.log(json);
 	}
 	else {
   	alert('操作失败');
 	}
});
```

#### *poiKeywordsSearch(city, keywords, cityLimit, callback)*
>poi关键字查询
>
>`city` 城市
>`keywords` 关键字
>`cityLimit` 是否限制在这一个城市内，bool值
>`callback` 回调方法 **(BOOL isSuccess, Array json)**
>
>```js
>MHMapSearch.poiKeywordsSearch('北京', '吃饭', true, (isSuccess, json)=>{
>```
	if (isSuccess) {
		console.log(json);
	}
	else {
		alert('操作失败');
	}
});
```


#### *poiIDSearch(ID, callback)*
>poi ID查询
>
>`ID`
>`callback` 回调方法 **(BOOL isSuccess, Object json)**
>
>```js
MHMapSearch.poiIDSearch('B000A8WXY0', (isSuccess, json)=>{
	if (isSuccess) {
		console.log(json);
	}
	else {
		alert('操作失败');
	}
});
```


#### *walkingRouteSearch(originCoordinate, destinationCoordinate, multipath, callback)*
>poi关键字查询
>
>`originCoordinate` 起点的坐标
>`destinationCoordinate` 目的地的坐标
>`multipath` 是否要备用路径，bool值
>`callback` 回调方法 **(BOOL isSuccess, Object json)**
>
>```js
>var originCoordinate = {
>```
	'latitude': 40.0000,
	'longitude': 120.0000,
};
var destinationCoordinate = {
	'latitude': 41.0000,
	'longitude': 122.0000,
};
MHMapSearch.walkingRouteSearch(originCoordinate, destinationCoordinate, 0,(isSuccess, json)=>{       
	if (isSuccess) {
	console.log(json);//json里面返回的是route
	}
	else {
		alert('操作失败');
	}
});
```

#### *walkingRouteSearch(originCoordinate, destinationCoordinate, multipath, callback)*
>poi关键字查询
>
>`originCoordinate` 起点的坐标
>`destinationCoordinate` 目的地的坐标
>`multipath` 是否要备用路径，bool值
>`callback` 回调方法 **(BOOL isSuccess, Object json)**
>
>```js
var originCoordinate = {
	'latitude': 40.0000,
	'longitude': 120.0000,
};
var destinationCoordinate = {
	'latitude': 41.0000,
	'longitude': 122.0000,
};
MHMapSearch.walkingRouteSearch(originCoordinate, destinationCoordinate, 0,(isSuccess, json)=>{       
	if (isSuccess) {
	console.log(json);//json里面返回的是route
	}
	else {
		alert('操作失败');
	}
});
```


## MHMapView文档 `AL-[112,)`

MHMapView是封装的高德地图view组件，具体的使用demo在sdk中**com.xiaomi.demoios插件中的MHMapDemo.js**中，MHMapView.js为组件的封装。

### 属性
mapType    number  0为普通地图，1卫星地图
multiPolylines array 
```javascript
            var multiPolyline = {
              'id':'multiPolyline' + i,
              'coordinates':coordinates,// 经纬度的object数组，key分别为 "longitude"、"latitude"
              'drawStyleIndexes':[0,1,2],//和下面的colors数组对应，具体看高德地图api
              'renderGradient':true,
              'renderLineWidth':12,
              'colors':[0xff0096ff,0xfff6c623,0xffff6600]
            };
            
            polylines.push(multiPolyline);
```

### 属性
pausesLocationUpdatesAutomatically, BOOL
allowsBackgroundLocationUpdates, BOOL
desiredAccuracy, double
headingFilter, double
`AL-[114,)`

