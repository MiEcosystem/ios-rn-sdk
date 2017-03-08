//index.ios.js

'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  DeviceEventEmitter
} from 'react-native';

var MHAudio = require('NativeModules').MHAudio;
var MHPluginSDK = require('NativeModules').MHPluginSDK;
const audioPlayerUid = 'com.xiaomi.demoios';

class MHAudioDemo extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  componentWillMount() {
    this.updateAudioPlayerTimeListener = DeviceEventEmitter.addListener(MHAudio.updateAudioPlayerTimeEvent, (event) => {
      if (event.audioPlayerUid === audioPlayerUid) {
        console.log(event.currentTime);//播放器播放的时间
      }
    });
    this.audioPlayerDidFinishPlayingListener = DeviceEventEmitter.addListener(MHAudio.audioPlayerDidFinishPlayingEvent, (event) => {
      if (event.audioPlayerUid === audioPlayerUid) {
        console.warn("播放完成,再次播放");
        this._startPlayButtonClicked();
      }
    });
    this.audioPlayerDidStartPlayingListener = DeviceEventEmitter.addListener('audioPlayerDidStartPlaying', (event) => {
      if (event.audioPlayerUid === audioPlayerUid) {
        alert('播放开始');
        console.warn(JSON.stringify(event));
      }
    });


  }

  componentWillUnmount() {
    this.updateAudioPlayerTimeListener.remove();
    this.audioPlayerDidFinishPlayingListener.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{top:100}} onPress={this._startRecordButtonClicked.bind(this)}>
          <Text style={{fontSize: 20}}>录音开始</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{top:150}} onPress={this._stopRecordButtonClicked.bind(this)}>
          <Text style={{fontSize: 20}}>录音结束</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{top:200}} onPress={this._startPlayButtonClicked.bind(this)}>
          <Text style={{fontSize: 20}}>播放开始</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{top:250}} onPress={this._stopPlayButtonClicked.bind(this)}>
          <Text style={{fontSize: 20}}>播放结束</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{top:300}} onPress={this._convertButtonClicked.bind(this)}>
          <Text style={{fontSize: 20}}>格式转换</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
    MHAudio.startRecord(MHAudio.docPath+'test.wav', settings, (isSuccess, response)=>{
      if (isSuccess) {
        alert('sucess');
      }
      else {
        alert(''+response);
      }
    });
  }

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

  _startPlayButtonClicked() {
    var params = {
      'updateAudioPlayerTimeInterval': 1,
      'audioPlayerUid': audioPlayerUid,
    };

    MHAudio.startPlayWithEventCallback(MHPluginSDK.basePath+'mp3/lovewholelife.mp3', params);
}
  _stopPlayButtonClicked() {
    MHAudio.stopPlay((isSuccess, response)=>{
      if (isSuccess) {
        alert('sucess');
      }
      else {
        console.log(response);
      }
    });
  }

  _convertButtonClicked() {
    var wavPath = MHAudio.docPath + 'test.wav';
    var amrPath = MHAudio.docPath + 'test.amr';
    MHAudio.wavToAmr(wavPath, amrPath, (isSuccess, response)=>{
      if (isSuccess) {
        alert('sucess');
      }
    });
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});


var route = {
  key: 'MHAudioDemo',
  title: '',
  component: MHAudioDemo,
}

module.exports = {
  component: MHAudioDemo,
  route: route,
}
