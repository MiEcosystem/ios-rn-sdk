# MiHomePlugin API参考文档
## MHPluginFS模块 `AL-[100,)`

MHPluginFS 模块主要提供插件对大数据的本地存储（轻量级数据存储可以使用 *MHPluginSDK.saveInfo* ），每个插件有固定的存储空间，不同设备model的插件不能互相访问，相同设备model的不同设备以及同一设备的不同插件版本共享同一片存储空间。插件应自行维护不同设备的文件以及插件版本升级可能带来的文件迁移过程。

```js
// 模块初始化
var MHPluginFS = require('NativeModules').MHPluginFS;
```

### 常量
#### *storageBasePath*
>插件存储基路径
>
>String
>

### 可以在插件端监听的事件
#### *fileIsDownloadingEventName*
>文件下载进度
>
>参见*downloadFile*方法

### 资源 URI
无

### API
#### *readFileList(callback)*
>读取文件列表。
>
>`callback` 回调方法 **(BOOL isSuccess, Array result)**
>
>```js
>MHPluginFS.readFileList((isSuccess, result) => {
>  result.forEach(function(e){  
>```
    console.log(e.name);  
  });
});
```

#### *writeFile(filename, utf8Content, callback)*
>写文件
>
>`filename` 文件名
>`utf8Content` 文件内容字符串
>`callback` 回调方法 **(BOOL isSuccess)**
>
>该方法用于写文本文件，文件会被保存在该插件的特定存储目录下，使用同一插件的设备存储空间共享，设备相关的信息存储时请按设备 id 取不同的文件名

#### *writeFileThroughBase64(filename, base64Content, callback)*
>写文件，输入为base64编码字符串，APP会解码成二进制 data 写入文件
>
>`filename` 文件名
>`base64Content` 文件内容字符串
>`callback` 回调方法 **(BOOL isSuccess)**
>
>该方法用于二进制文件，javascript 无法处理二进制数据，需要使用 base64 编码，APP 端会自动解码后存储，文件会被保存在该插件的特定存储目录下，使用同一插件的设备存储空间共享，设备相关的信息存储时请按设备 id 取不同的文件名。

#### *appendFile(filename, utf8Content, callback)*
>向文件追加内容
>
>`filename` 文件名
>`utf8Content` 文件内容字符串
>`callback` 回调方法 **(BOOL isSuccess)**
>

#### *appendFileThroughBase64(filename, base64Content, callback)* 
>向文件追加内容，输入为base64编码字符串，APP会解码成二进制 data 写入文件
>
>`filename` 文件名
>`base64Content` 文件内容字符串
>`callback` 回调方法 **(BOOL isSuccess)**
>

#### *deleteFile(filename, callback)*
>删除文件
>
>`filename` 文件名
>`callback` 回调方法 **(BOOL isSuccess)**

#### *readFile(filename, callback)*
>读文件
>
>`filename` 文件名
>`callback` 回调方法 **(BOOL isSuccess, utf8Content)**

#### *readFileToBase64(filename, callback)*
>读文件，转换成 Base64 编码
>
>`filename` 文件名
>`callback` 回调方法 **(BOOL isSuccess, base64Content)**

#### *uploadFile(params, callback)*
>上传文件
>
>`params` 参数字典
>`callback` 回调方法 **(null, Object response)**
>
>**注意** 接收文件的URL需要插件开发者自己提供。
>
>```js
var params = {
  uploadUrl: 'http://127.0.0.1:3000',
  method: 'POST', // default 'POST',support 'POST' and 'PUT'
  headers: {
      'Accept': 'application/json',
  },
  fields: {
      'hello': 'world',
  },
  files: [
  {
      filename: 'filename.png', // 只能上传插件sandbox里的文件
  },
  ]
};
MHPluginFS.uploadFile(params, (c, response) => {
  console.log(response.state, response.data);
});
```

#### *uploadFileToFDS(params, callback)* `AL-[103,)`
>上传文件到小米云FDS
>
>`params` 参数字典
>`callback` 回调方法 **(null, Object response)**
>
>**注意** 专门用来向FDS发送文件，参数格式与uploadFile保持一致，一次只能发送一个文件
>
>```js
> MHPluginSDK.callSmartHomeAPI("/home/genpresignedurl", {"did":MHPluginSDK.deviceId,"suffix":"png"}, (response) => {
>  // console.log("+++++++++++++++++++++++"+JSON.stringify(response));
>  if (response !== null && response.code === 0 && result !== null ) {
>```
    var result = response.result;
    if (result.hasOwnProperty('png') && result.png !== null) {
      var png = result.png;
      if (png.url !== null) {
        var obj_name = png.obj_name;
        var name = obj_name.substring(obj_name.length-22);
        MHPluginFS.writeFileThroughBase64(name, picture, (isSuccess) => {
          if (isSuccess) {
            var params = {
              uploadUrl: png.url,
              method: 'PUT', // default 'POST',support 'POST' and 'PUT'
              headers: {
                "Content-Type":""
              },             
              files: [
                {
                  filename: name, // 只能上传插件sandbox里的文件
                },
              ]
            };
            MHPluginFS.uploadFileToFDS(params, (c, response) => {
              console.log(response.state, response.data);
            });
          };
        });
      };
    };
  } else {
    AlertIOS.alert("温馨提示","上传头像失败，请重试！");
  };
});
```

#### *downloadFile(url, filename, callback)*
>下载文件到插件存储空间
>
>`url` 文件地址
>`filename` 存储到本地的文件名
>`callback` 回调方法 **(bool isSuccess, Object result)**
>
>**注意** 回调方法只有在最后成功或者失败后才会执行，result中包含下载完成的本地文件完整路径。如果需要监听下载进度，请订阅 *MHPluginFS.fileIsDownloadingEventName* 事件
>
>```js
// 下载文件
MHPluginFS.downloadFile(url, "test.zip", (success, result) => {
  if (success && result.path) {
    MHPluginFS.readFileToBase64(result.filename, (success, base64Content) => {
      if (success) {
        MHPluginFS.dataLengthOfBase64Data(base64Content, (length) => {
          MHPluginFS.subBase64DataOfBase64Data(base64Content, 3500, 100, (success, base64SubData) => {
            alert(""+base64SubData);
          });
        });
      }
    });
  }
});
// 订阅下载进度
var { DeviceEventEmitter } = require('react-native');
subscription = DeviceEventEmitter.addListener(MHPluginFS.fileIsDownloadingEventName, (notification) => {
  console.log(""+JSON.stringify(notification));
});
```

#### *dataLengthOfBase64Data(base64Data, callback)*
>获取data长度
>
>`base64Data` base64编码的data
>`callback` 回调方法 **(int length)**

#### *subBase64DataOfBase64Data(base64Data, loc, len, callback)*
>获取一个data的子data（base64编码）
>
>`base64Data` base64编码的data
>`loc` 起始位置
>`len` 长度
>`callback` 回调方法 **(bool isSuccess, String subData)**

#### *unzipFile(fileName, callback)*
>解压缩一个zip文件
>
>`fileName` 文件名（只能是在插件存储空间内的文件）
>`callback` 回调方法 **(bool isSuccess)**
>
>解压缩后的文件会直接存储在插件存储空间的根目录下

#### *ungzFile(fileName, callback)*
>解压缩一个gz文件
>
>`fileName` 文件名（只能是在插件存储空间内的文件）
>`callback` 回调方法 **(bool isSuccess, String base64Data)**
>
>与zip解压不同，这个方法只会把数据解压缩到内存里，并以base64编码的形式直接返回给插件，而不会做本地存储

#### *screenShot(imageName, callback)* `AL-[101,)`
>屏幕截屏，截全屏
>
>`imageName` 图片的名称，格式为png
>`callback` 回调方法 **(bool isSuccess, String imagePath)**
>
>**注意** imagePath是存储图片的全路径，加载图片的时候直接使用即可
>
>```js
>MHPluginFS.screenShot('test1.png', (isSuccess, response) => {
>```
	if (isSuccess) {
		console.log(response);
	}
});
>```
>
>**注意** imagePath是存储图片的全路径，加载图片的时候直接使用即可
>
>​```js
><Image style={styles.img} source={{uri:this.imagePath, scale:PixelRatio.get()}} />
>```

#### *screenShotInRect(imageName, rect, callback)* `AL-[106,)`
>屏幕截屏，自定义范围
>
>`imageName` 图片的名称，格式为png
>`rect` 截屏范围；不用考虑屏幕的scale，接口内部已做处理；
>`callback` 回调方法 **(bool isSuccess, String imagePath)**
>
>```js
>var rect = {
>```
        l: 0,
        t: 0,
        w: 414,
        h: 200,
      };
      MHPluginFS.screenShotInRect('test2.png', rect, (isSuccess, response) => {
        if (isSuccess) {
          console.log(response);
        }
      });
>```
>**注意** imagePath是存储图片的全路径，加载图片的时候直接使用即可
>
>​```js
><Image style={styles.img} source={{uri:this.imagePath, scale:PixelRatio.get()}} />
>```

#### *longScreenShot(viewRef, imageName, callback)* `AL-[108,)`
>长截屏，用来截scrollView，会把超出屏幕的部分也截到
>
>`viewRef` scrollView的引用
>`imageName` 图片的名称，格式为png
>`callback` 回调方法 **(bool isSuccess, String imagePath)**
>
>```js
>var findNodeHandle = require('findNodeHandle');
>var myScrollView = findNodeHandle(this.refs.myScrollView);
>MHPluginFS.screenShotInRect(myScrollView,'test2.png', (isSuccess, response) => {
>```
    if (isSuccess) {
        console.log(response);
    }

>```
>**注意** imagePath是存储图片的全路径，加载图片的时候直接使用即可
>```
>
```js
<Image style={styles.img} source={{uri:this.imagePath, scale:PixelRatio.get()}} />
```



#### *amapScreenShot(viewRef, imageName, callback)* `AL-[114,)`
>高德地图截屏
>
>`viewRef` MAMapView(MHMapView的父类)的引用
>`imageName` 截取图片的存储名称，格式为png，会自动添加后缀.png
>`callback` 回调方法 **(bool isSuccess, String imagePath)**
>
```js
var findNodeHandle = require('findNodeHandle');
var myMapViewRef = findNodeHandle(this.refs.myMapView);
MHPluginFS.amapScreenShot(myMapViewRef, 'mapToShare.png',  (isSuccess, imagePath) => {

    if (isSuccess) {
        console.log(imagePath);
    }
}
//  imagePath是存储图片的全路径，加载图片的时候直接使用即可
```


#### *getRGBAValueFromImageAtPath(imagePath, points, callback)* `AL-[115,)`

>获取图片指定点的色值
>
>`imagePath` 图片文件路径
>`points` 位置数组，传空数组将返回所有点的色值(数据量太大会很慢)
>`callback` 回调方法 **(bool isSuccess, Array colorValues)** 
>
>colorValues 为色值的数组，如果points参数不为空，为各个点的色值，rgba值组成的数组，[0, 255]；如果points为空，则返回色值的二维数组，大小为所有像素点,长宽的乘积
```js
var fsSDK = require('NativeModules').MHPluginFS;   fsSDK.getRGBAValueFromImageAtPath(this.props.app.sourceOfImage("hello_raise.jpg").uri,[{x:20,y:20},{x:40,y:60}],(success,rgba) =>{
      if (success) {
        console.warn("第一个点色值" + rgba[0]);
        console.warn("第二个点色值" + rgba[1]);
      }

    });
    
```
