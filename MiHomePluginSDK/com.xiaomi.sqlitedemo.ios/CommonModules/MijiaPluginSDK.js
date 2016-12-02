'use strict';

const React = require('react-native');

const {
  Platform,
} = React;

var MijiaPluginNative = require('NativeModules').MijiaPluginNative;

const MijiaPluginSDK = {

  DEV : MijiaPluginNative.DEV,
  pushParams : MijiaPluginNative.pushParams,
  sceneInfo : MijiaPluginNative.sceneInfo,
  extraInfo : MijiaPluginNative.extraInfo,
  basePath : MijiaPluginNative.basePath,
  userId : MijiaPluginNative.userId,
  userName : MijiaPluginNative.userName,
  APPBAR_HEIGHT : MijiaPluginNative.APPBAR_HEIGHT,
  device : MijiaPluginNative.device,

  callDeviceMethod(method, params) {
    if (Platform.OS == 'ios') {
      let promise = new Promise(function(resolve, reject) {
        MijiaPluginNative.callDeviceMethod(method, params)
        .then((result) => {resolve(result)})
        .catch((error) => {reject(error)});
      });
      return promise;
    }
  },

  callRemoteAPI(api, params) {
    if (Platform.OS == 'ios') {
      let promise = new Promise(function(resolve, reject) {
        MijiaPluginNative.callRemoteAPI(api, params)
        .then((result) => {resolve(result)})
        .catch((error) => {reject(error)});
      });
      return promise;
    }
  },

  callThirdPartyAPI(serverAppId, dids, params) {
    if (Platform.OS == 'ios') {
      let promise = new Promise(function(resolve, reject) {
        MijiaPluginNative.callThirdPartyAPI(serverAppId, dids, params)
        .then((result) => {resolve(result)})
        .catch((error) => {reject(error)});
      });
      return promise;
    }
  },

  deviceSnapshotFromMem(keys) {
    if (Platform.OS == 'ios') {
      let promise = new Promise(function(resolve, reject) {
        MijiaPluginNative.deviceSnapshotFromMem(keys)
        .then((result) => {resolve(result)})
        .catch((error) => {reject(error)});
      });
      return promise;
    }
  },

  setDevicePropsToMem(kvPairs) {
    if (Platform.OS == 'ios') {
      return MijiaPluginNative.setDevicePropsToMem(kvPairs);
    }
  },

  exitPlugin() {
    if (Platform.OS == 'ios') {
      return MijiaPluginNative.exitPlugin();
    }
  },

  sendEvent(eventName, body) {
    if (Platform.OS == 'ios') {
      return MijiaPluginNative.sendEvent(eventName, body);
    }
  },

  addStatRecord(type, value, extra) {
    if (Platform.OS == 'ios') {
      return MijiaPluginNative.addStatRecord(type, value, extra);
    }
  },

  finishCustomSceneSetup(payload) {
    if (Platform.OS == 'ios') {
      return MijiaPluginNative.finishCustomSceneSetup(payload);
    }
  },
}
module.exports = MijiaPluginSDK;
