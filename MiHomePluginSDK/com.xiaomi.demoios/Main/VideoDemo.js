//index.ios.js

'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Dimensions,
  PanResponder
} from 'react-native';
import Video from 'react-native-video';

var window = Dimensions.get('window');

class VideoDemo extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentTime: 5.0,
      progress: 0,
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      // onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant.bind(this),
      // onPanResponderMove: this._handlePanResponderMove,
      // onPanResponderRelease: this._handlePanResponderEnd,
      // onPanResponderTerminate: this._handlePanResponderEnd,
    });
  }

  //需要在工程本地导入一个名为'broadchurch'的mp4文件;
  render() {
    return (
      <View style={styles.container}>
        <Video
          style={styles.video}
          source={{uri:'broadchurch'}}
          rate={1.0}
          volume={1.0}
          muted={false}
          paused={false}
          resizeMode='cover'
          repeat={false}
          playInBackground={false}
          playWhenInactive={false}
          currentTime={this.state.currentTime}
          onProgress={this._onProgress.bind(this)}
          />
        <View style={styles.progressLine} {...this._panResponder.panHandlers} />
        <View style={[styles.progressArrow, {left: this.state.progress * window.width - 10}]} />
      </View>
    );
  }

  _onProgress(e) {
    // console.log('currentTime' + e.currentTime);
    this.playableDuration = e.playableDuration;
    this.setState({
      progress: e.currentTime / e.playableDuration,
    });
  }

  _handleStartShouldSetPanResponder(e: Object, gestureState: Object): boolean {
    return true;
  }

  _handlePanResponderGrant(e: Object, gestureState: Object) {
    var currentTime = this.playableDuration * e.nativeEvent.locationX / window.width;
    this.setState({
      currentTime: currentTime,
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  video: {
    width: window.width,
    height: window.height,
  },
  progressLine: {
    width: window.width,
    height: 10,
    bottom: 30,
    backgroundColor: 'blue'
  },
  progressArrow: {
    position: 'absolute',
    width: 20,
    height: 20,
    bottom: 25,
    left: 0,
    backgroundColor: 'red',
  },
});

var route = {
  key: 'VideoDemo',
  title: '',
  component: VideoDemo,
}

module.exports = {
  component: VideoDemo,
  route: route,
}
