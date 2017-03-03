# MiHomePlugin API参考文档
## MHAudio模块 `AL-[106,)`

MHPluginSDK 模块主要提供插件可以调用的native端有关音频的API，包括录音、播放、格式转换等。

```js
// 模块初始化
var MHAudio = require('NativeModules').MHAudio;
```

### 常量
#### 无



### 可以在插件端监听的事件
#### *updateAudioPlayerTimeEvent*
>更新播放器播放时间
>
>AudioPlayer播放时，会根据设置的时间间隔，把AudioPlayer播放时间定时发送给插件端；
>时间间隔是startPlay时，params里面的参数，详情参考api部分的startPlay接口；
>每一个AudioPlayer有一个uid，也是用户在startPlay时，通过params字典对应的参数设置的；
>插件端监听到事件时，要判断uid是不是自己设置的，来防止别人调用MHAudio产生干扰；
>
>插件可以在该事件回调中获取播放时间，来制作进度条等；
>
```js
componentWillMount() {
 this.updateAudioPlayerTimeListener = 	DeviceEventEmitter.addListener(MHAudio.updateAudioPlayerTimeEvent, (event) => {
      if (event.audioPlayerUid === audioPlayerUid) {
        console.log(event.currentTime);//播放器播放的时间
      }
    });
```

#### *audioPlayerDidFinishPlayingEvent*
>当前的audioPlayer播放完成
>
>用户调用startPlay播放一个audio后，如果不调用stopPlay，audioPlayer播放完成时，会向插件端发送这个事件。同样的，要先判断uid是否是自己设置的那一个；
>
```js
componentWillMount() {
	this.audioPlayerDidFinishPlayingListener = 	DeviceEventEmitter.addListener(MHAudio.audioPlayerDidFinishPlayingEvent, 	(event) => {
      if (event.audioPlayerUid === audioPlayerUid) {
        alert('播放完成');
      }
    });
}
```

### 资源 URI
####音频文件路径获取

>音频资源文件放在Resources目录下，用MHPluginSDK.basePath+"path/to/audio.mp3"的拼接方式，其中path/to/audio.mp3为Resources目录下的路径

### API
#### *startRecord:(audioName, settings, callback)*
>开始录音。
>
>`audioName` 录音文件的名字，包括格式
>`settings` 录音的配置参数。
>`callback` 录音开始操作是否成功。
>
```js
_startRecordButtonClicked() {
    var settings = {
      AVFormatIDKey: 'audioFormatLinearPCM',
      AVSampleRateKey: 9500,
      AVNumberOfChannelsKey: 2,
      AVEncoderAudioQualityKey: 'audioQualityHigh',
      AVLinearPCMBitDepthKey: 16,
      AVLinearPCMIsBigEndianKey: false,
      AVLinearPCMIsFloatKey: false,
    };
    var path = MHAudio.docPath+'test.wav';
    MHAudio.startRecord(path, settings, (isSuccess, response)=>{
      if (isSuccess) {
        alert('sucess');
      }
      else {
        alert(''+response);
      }
    });
  }
```

#### *stopRecord:(callback)*
>停止录音。
>
>`callback` 停止录音操作是否成功。
>
```js
_stopRecordButtonClicked() {
    MHAudio.stopRecord((isSuccess, response)=>{
      if (isSuccess) {
        alert('sucess');
      }
      else {
        console.log(response);
      }
    });
  }
```

#### *startPlay:(audioName, params, callback)*
>开始播放。
>
>`audioName` 要播放的文件的名字，包括格式；
>`params` 播放相关的参数，包括播放器的uid，播放时间刷新的间隔，播放是否可以快进等。params 的key：numberOfLoops，audioPlayerUid(回调中会带着此参数区分是哪个播放器的回调)，updateAudioPlayerTimeInterval，forceStopPreAudio(强制上一个播放失效，默认为false) forceStopPreAudio 生效从apilevel 116开始
>`callback` 播放开始操作是否成功的回调，除了是否成功之外，还返回将要播放的文件的时间长度；
```js
_startPlayButtonClicked() {
    var params = {
      'updateAudioPlayerTimeInterval': 1,
      //最短为1秒；如果不设置，则不会发生updateAudioPlayerTimeEvent事件；
      'audioPlayerUid': audioPlayerUid,
      //播放器的唯一id;
    };
    var path = MHAudio.docPath+'test.wav';
    MHAudio.startPlay(path, params, (isSuccess, response)=>{
      if (isSuccess) {
        alert('sucess');
        var duration = response.duration;
      }
      else {
        console.log(response);
      }
    });
  }
```

#### *stopPlay:(callback)*
>开始播放。
>
>`callback` 停止播放操作是否成功的回调；
>
```js
_stopPlayButtonClicked() {
    MHAudio.stopPlay( (isSuccess, response)=>{
      if (isSuccess) {
        alert('sucess');
      }
      else {
        console.log(response);
      }
    });
  }
```

#### *wavToAmr:(wavPath, savePath, callback)*
>把wav格式转换为amr格式。
>
>`wavPath` wav文件的全路径；
>`savePath` 转换完成后的存储路径。
>`callback` 转换是否成功；
>
```js
_convertButtonClicked() {
    var wavPath = MHAudio.docPath + 'test.wav';
    var savePath = MHAudio.docPath + 'test.amr';
    MHAudio.wavToAmr(wavPath, savePath, (isSuccess, response)=>{
      if (isSuccess) {
        alert('success');
      }
    });
```

#### *amrToWav:(amrPath, savePath, callback)*
>把amr格式转换为wav格式。
>
>`amrPath` amr文件的全路径；
>`savePath` 转换完成后的存储路径。
>`callback` 转换是否成功；
>
```js
_convertButtonClicked() {
    var amrPath = MHAudio.docPath + 'test.amr';
    var savePath = MHAudio.docPath + 'test.wav';
    amrToWav(wavPath, savePath, (isSuccess, response)=>{
      if (isSuccess) {
        alert('success');
      }
    });
```




