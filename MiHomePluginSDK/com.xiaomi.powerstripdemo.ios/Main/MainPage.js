/**
 * 小米智能家庭iOS客户端 智能插排插件 Demo
 * http://open.home.mi.com
 */
'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  DeviceEventEmitter,
  StatusBar,
} = React;

var MHPluginSDK = require('NativeModules').MHPluginSDK;
var MHJSPatch = require('NativeModules').MHJSPatch;

// 一个简单的按钮组件
var Button = require('../CommonModules/Button');

// 倒计时页面Component
var Countdown = require('./CountDown');

var PowerCostPage = require('./PowerCostPage');
// 获取屏幕尺寸
var window = Dimensions.get('window');
var ratio = window.width / 375;

var MainPage = React.createClass({
  getInitialState: function() {
    // MHPluginSDK提供了设备和插件系统相关的各种常量，详见MHPluginSDK文档，获取图片资源请使用this.props.app.sourceOfImage(imageName)方法
    return {
      did: MHPluginSDK.deviceId,
      model: MHPluginSDK.deviceModel,
      apiLevel: MHPluginSDK.apiLevel,
      devMode: MHPluginSDK.devMode,
      currentState: '',
      now:new Date(),
      hourFromNow: 0,
      minuteFromNow: 0,
      recentTimer: "0 0 0 0 0",
      us_id: 0,
    };
  },

  componentWillMount: function() {
    // 监听设备改名通知
    this._deviceNameChangedListener = DeviceEventEmitter.addListener(MHPluginSDK.deviceNameChangedEvent, (event) => {
      route.title = event.newName;
      this.forceUpdate();
    });
  },

  componentDidMount: function() {
    // 可以在这里注册监听设备状态6s轮询的通知，监听前需要用registerDeviceStatusProps方法来指定轮询哪些设备属性，将会调用RPC的getProps方法与设备通信获取相应属性值
    MHPluginSDK.registerDeviceStatusProps(["power"]);
    this._deviceStatusListener = DeviceEventEmitter.addListener(
      MHPluginSDK.deviceStatusUpdatedEventName,
      (notification) => {
        console.log("Device status Refreshed! " + notification.eventName);
        var now = new Date();
        MHPluginSDK.getDevicePropertyFromMemCache(["power"], (pairs) => {
          this.setState({
            now: now,
            currentState: pairs.power,
          });
        });

        //从后台获取设备的定时列表
        var TimerQuestData = {
          "did": this.state.did,
          "st_id": "8",
          "identify": this.state.did,
        }
        MHPluginSDK.callSmartHomeAPI('/scene/list',TimerQuestData,(response) => {
          var timerArray = [];
          if(this.state.currentState == 'on'){
            for(var key in response.result){
              if(response.result[key].setting.enable_timer == '1' && response.result[key].setting.enable_timer_off == '1'){
                timerArray.push(response.result[key].setting.off_time.split(" ").reverse().join(" ")+":"+response.result[key].us_id);
              }
            }
          }else if(this.state.currentState == 'off'){
            for(var key in response.result){
              if(response.result[key].setting.enable_timer == '1' && response.result[key].setting.enable_timer_on == '1'){
                timerArray.push(response.result[key].setting.on_time.split(" ").reverse().join(" ")+":"+response.result[key].us_id);
              }
            }
          }

          if(timerArray.length > 0){

            var recentTimer = timerArray.sort()[0];
            var us_id = recentTimer.split(":")[1];
            recentTimer = recentTimer.split(":")[0];
            var minuteFromNow = 0,
                hourFromNow = 0;
            var borrow = 0; //借位
            if(recentTimer.split(" ")[4] - now.getMinutes() >= 0){
              minuteFromNow = recentTimer.split(" ")[4] - now.getMinutes();
            }else{
              minuteFromNow = recentTimer.split(" ")[4] - now.getMinutes() + 60;
              borrow = -1;
            };
            hourFromNow = recentTimer.split(" ")[3] - now.getHours() + borrow;
            if(hourFromNow < 0){
              hourFromNow += 24;
            }
            this.setState({
              recentTimer : recentTimer,
              us_id: us_id,
              minuteFromNow : minuteFromNow,
              hourFromNow : hourFromNow,
            });

          }else{
            this.setState({
              us_id: 0,
              minuteFromNow: 0,
              hourFromNow: 0,
            });
          }

        });
      }

    );
  },

  componentWillUnmount: function() {
    this._deviceNameChangedListener.remove();
    this._deviceStatusListener.remove();
  },

  _handlePress: function() {
    MHPluginSDK.callMethod('toggle',[],{}, (isSuccess, json) => {
      console.log("toggle result:"+isSuccess+json);
      if (isSuccess)
      {
        this.setState({
          currentState: this.state.currentState == 'on' ? 'off' : 'on',
        });
      }
    });
  },

  onOpenTimerSettingPage: function() {
      // 打开定时设置页面
      MHPluginSDK.openTimerSettingPage("set_power", "on", "set_power", "off");
  },

  _onCountdownClick: function() {
    var countdownRoute={
      ...Countdown.route,
      passProps: {
        currentState: this.state.currentState,
        hourFromNow: this.state.hourFromNow,
        minuteFromNow: this.state.minuteFromNow,
        us_id: this.state.us_id,
        },
      };
      this.props.navigator.push(countdownRoute);
  },

  _onButtonClick: function() {
    MHJSPatch.evaluateScriptName("PowerStatistics.js", (result) => {
    });
  },

  _onOpenPowerCostPage() {
    var powerCostPage = {
      ...PowerCostPage.route,
      passProps: {
        },
      };
      this.props.navigator.push(powerCostPage);
  },

  render: function() {
    var background;
    if (this.state.currentState == 'on')
    {
      background = (<View style={styles.background}>
      <Image style={styles.background} source={this.props.app.sourceOfImage((this.state.currentState == 'on' ? 'on_background.png' : 'off_background.png'))} resizeMode='cover'>
      </Image>
      </View>);
    }
    else {
      background = (<Image style={styles.background} source={this.props.app.sourceOfImage((this.state.currentState == 'on' ? 'on_background.png' : 'off_background.png'))} resizeMode='cover'>
      </Image>);
    }
    return (
      <View style={styles.background}>
      <StatusBar barStyle='light-content' />
      {background}
      <View style={[styles.container,{width: window.width,height: window.height}]}>
        <View style={styles.top}>
          <Image style={styles.timeCircle} source={this.props.app.sourceOfImage("time_ruler.png")}>
            <View style={[styles.pointerFrame,{transform:[{rotate:(-43 + this.state.now.getHours() * 11.08 + this.state.now.getMinutes() * 0.1847 + 'deg')}]}]}>
              <Image style={styles.pointer} source={this.props.app.sourceOfImage("indicator_triangle.png")} resizeMode='contain'/>
            </View>
            <Image style={styles.timeProgress} source={this.props.app.sourceOfImage("time_progress.png")}>
              <TouchableOpacity onPress={this._handlePress}>
                <Image style={styles.power} source={this.props.app.sourceOfImage("on_off_button.png")} />
              </TouchableOpacity>
            </Image>
          </Image>
          <Text style={{fontSize: 14,color: '#FFFFFF'}}>智能插线板已{this.state.currentState == 'on' ? '开启' : '关闭'}</Text>
          <Text style={{fontSize: 12,color: '#FFFFFF', opacity: this.state.hourFromNow == 0 && this.state.minuteFromNow == 0 ? 0 : 0.6,marginTop: 9,}}>{this.state.hourFromNow}小时{this.state.minuteFromNow}分后{this.state.currentState == 'on' ? '关闭' : '开启'}</Text>
        </View>
        <View style={styles.bottom}>
          <Button style={styles.button} onPress={this.onOpenTimerSettingPage} title='定时' titleSize={11} imageNormal="timing_normal.png" imageHighlight="timing_press.png" highlightColor='transparent' />
          <Button style={styles.button} onPress={this._onCountdownClick} title='倒计时' titleSize={11} imageNormal="countdown_normal.png" imageHighlight={this.props.app.sourceOfImage("countdown_press.png")} highlightColor='transparent' />
          <Button style={styles.button} onPress={this._onButtonClick} title='电力统计1' titleSize={11} imageNormal="electricity_normal.png" imageHighlight="electricity_press.png" highlightColor='transparent' />
          <Button style={styles.button} onPress={this._onOpenPowerCostPage} title='电力统计2' titleSize={11} imageNormal="electricity_normal.png" imageHighlight="electricity_press.png" highlightColor='transparent' />
        </View>
      </View>
    </View>
    );
  },
});

var styles = StyleSheet.create({
  background: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
  },
  container: {
    position: 'absolute',
    top: 0,
    flex: 1,
    justifyContent: 'center',
    marginBottom: 0,
    marginTop: 0,
    backgroundColor: 'transparent',
  },
  top: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
  },
  timeCircle: {
    width: 306 * ratio,
    height: 260 * ratio,
    marginTop: window.height < 500? 120 * ratio : 150 * ratio,
    alignItems: 'center',
  },
  pointerFrame: {
    width:256 * ratio,
    height:9.67 * ratio,
    // borderWidth: 1,
    alignSelf: 'flex-start',
    position: 'relative',
    top:150 * ratio,
    left:25 * ratio,
  },
  pointer: {
    width: 4.67 * ratio,
    height: 8.67 * ratio,
  },
  timeProgress: {
    width:240 * ratio,
    height: 201 * ratio,
    marginTop: 27 * ratio,
    alignItems: 'center',
  },
  power: {
    width: 82 * ratio,
    height: 86 * ratio,
    marginTop: 73 * ratio,
  },
  bottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: 54 * ratio,
    height: 54 * ratio,
  },
  text: {
    fontSize: 20 * ratio,
    textAlign: 'center',
    color: '#000000',
    alignSelf: 'stretch',
    marginTop: 10 * ratio,
  },
});

const KEY_OF_MAINPAGE = 'MainPage';

// 每个页面export自己的route
var route = {
  key: KEY_OF_MAINPAGE,
  title: MHPluginSDK.deviceName,
  component: MainPage,
  navLeftButtonStyle: {
    tintColor:'#ffffff',
  },
  navTitleStyle: {
    color:'#ffffff',
  },
  navBarStyle: {
    backgroundColor:'transparent',
  },
  isNavigationBarHidden: false,
}

module.exports = {
  component: MainPage,
  route: route,
}
