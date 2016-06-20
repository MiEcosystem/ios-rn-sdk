'use strict'

 var React = require('react-native');
 var {
   PanResponder,
   StyleSheet,
   Text,
   View,
   Image,
   TouchableOpacity,
   TouchableHighlight,
   Dimensions,
   ListView,
   PickerIOS,
 } = React;

 var ReactART = require('ReactNativeART');
 var {
   Surface,
   Path,
   Group,
   Transform,
   Shape,
 } = ReactART;

var window = Dimensions.get('window');
var ratio = window.width / 375;
var MHPluginSDK = require('NativeModules').MHPluginSDK;
var subscription;
var PickerItemIOS = PickerIOS.Item;
var pickHour = [];
var pickMinutes = [];
var us_id;

var CIRCLE_PATH = "M"+173.5*ratio+" "+0.43*ratio+" A "+130*ratio+" "+130*ratio+", 0, 1, 0, "+201.5*ratio+" "+0.43*ratio;
var P_CIRCLE_PATH = "M151 37 A 14 14, 0, 1, 1, 150 37 Z";
var POINTER_PATH = "M148 46 L154 50 L148 54";
var LINE_PATH = "M"+window.width/2+" "+108.1*ratio+" v "+17*ratio;

var styles = StyleSheet.create({
  background: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
    alignItems: 'center',
  },
  pointerContainer: {
    width: 50 * ratio,
    height: 50 * ratio,
    position: 'absolute',
    backgroundColor: 'transparent',
    top: -20 * ratio,
    left: 160 * ratio,
  },
  pointer: {
    width:24 * ratio,
    height: 24 * ratio,
    marginTop: 8 * ratio,
    marginLeft: 15 * ratio,
  },
  triangle: {
    width:24 * ratio,
    height: 24 * ratio,
    marginTop: 3 * ratio,
    marginLeft: 14 * ratio,
  },
  surface: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  centerText: {
    position: 'absolute',
    top:208 * ratio,
    left: 100 * ratio,
    fontSize: 20 * ratio,
    color: '#FFFFFF'
  },
  rotate: {
    position: 'absolute',
  },
  top: {
    flex: 0.641,
    backgroundColor: 'transparent',
  },
  bottom: {
    flex: 0.359,
    backgroundColor: 'white',
  },
  list: {
    flex: 0.7,
  },
  item: {
    height: 55 * ratio,
    borderBottomWidth: 1,
    borderColor: '#E4E4E4',
    justifyContent: 'center',
  },
  listText: {
    paddingLeft: 21 * ratio,
    fontSize: 12 * ratio,
    color: '#333333',
  },
  button: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelContainer: {
    flexDirection: 'row',
  },
  confirm: {
    width: 300 * ratio,
    height: 50 * ratio,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmText: {
    fontSize: 15 * ratio,
    color: '#333333',
  },
  cancel: {
    width: 150 * ratio,
    height: 50 * ratio,
    borderWidth: 1,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stop: {
    width: 150 * ratio,
    height: 50 * ratio,
    borderWidth: 1,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerCover: {
    width: window.width,
    height: window.height,
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent',
  },
  pickerTop: {
    width: window.width,
    height: window.height < 500? 308 : 380 * ratio,
    marginTop: 0,
    backgroundColor: '#000',
    opacity: 0.4,
  },
  pickerBottom: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: window.width,
    height: window.height < 500? window.height - 308 : window.height - 380 * ratio,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: window.height < 500? 100 : 180 * ratio,
    width: window.width,
    overflow: 'hidden',
  },
  picker: {
    width: 100 * ratio,
    height: window.height < 500? 200 : 180 * ratio,
  },
  pickerConfirm: {
    width: 300 * ratio,
    height: 50 * ratio,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#E4E4E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: window.height < 500? 25 : 40 * ratio,
  },
  pickerText: {
    marginTop: window.height < 570 ? 45 : 30 * ratio,
    fontSize: 20 * ratio,
    height: window.height < 500? 200 : 180 * ratio,
    lineHeight: window.height < 500? 94 : (180 * ratio)/1.68,
  },
  text: {
    position: 'absolute',
    top: 66 * ratio,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: 20 * ratio,
  },
});

//初始化picker数据
    for(var i=0;i<24;i++){
      pickHour.push(
        {value: i,label: i.toString()}
      )
    };
    for(var j=0;j<60;j++){
      pickMinutes.push(
        {value: j,label: j.toString()}
      )
    };

    var rows = [];
    var circle = (<Surface width={window.width} height={427.536 * ratio} style={styles.surface} >
        <Shape d={CIRCLE_PATH} stroke="#FFFFFF" strokeWidth={1} />
    </Surface>);

var CountDown = React.createClass({
    getInitialState: function() {
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      return {
        did: MHPluginSDK.deviceId,
        model: MHPluginSDK.deviceModel,
        apiLevel: MHPluginSDK.apiLevel,
        devMode: MHPluginSDK.devMode,
        dataSource: ds.cloneWithRows([{type: 1,rotation: 6,text: '1分钟'},{type: 1,rotation: 18,text: '3分钟'},{type: 1,rotation: 30,text: '5分钟'},{type: 2,text: '自定义'}]),
        rotation:0,
        circleCount: 0,
        minutes: 0,
        hours: 0,
        showPicker: false,
        isCounting: false,
      };
    },

    setRotation: function(x,y,vx) {
          console.log(""+x+" "+y+" "+vx);
          if(x >= 0 && y >= 0) {
            return (0.5 * Math.PI - Math.atan(y / x)) * (180 / Math.PI);
          }else if(x > 0 && y < 0){
            return (0.5 * Math.PI + Math.atan(-y / x) ) * (180 / Math.PI);
          }else if(x <= 0 && y <= 0) {
            return (Math.PI + Math.atan(Math.abs(x / y))) * (180 / Math.PI);
          }else if(x < 0 && y > 0) {
            return (2 * Math.PI - Math.atan(-x / y)) * (180 / Math.PI);
          }
    },
    lastX: window.width / 2,
    lastY: 0,
    componentWillMount: function() {
        this._panResponder = PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: (event,gestureState) => {
            this.setState({x0: gestureState.x0, y0:gestureState.y0});
          },
          onPanResponderMove: (event,gestureState) => {
            //第一圈阻止负度数
            if(this.state.circleCount == 0 && this.lastX >= window.width / 2 && gestureState.moveX <= window.width / 2 && this.state.rotation < 120){
              this.setState({
                rotation: 0,
                minutes: 0,
                hours: 0,
              });
              return;
            };
            //判断是否过0度点，增加、减少圈数
            if(this.lastX < window.width / 2 && gestureState.moveX >= window.width / 2 && gestureState.moveY < 222){
              this.setState({
                isCounting: false,
                circleCount: this.state.circleCount + 1,
                hours: this.state.hours + 1,
                rotation: this.setRotation(gestureState.moveX - window.width / 2, 222 * ratio - gestureState.moveY,gestureState.vx) + (this.state.circleCount + 1) * 360,
                minutes: Math.floor(this.state.rotation % 360 / 6),
              });
            }else if(this.lastX > window.width / 2 && gestureState.moveX <= window.width / 2 && gestureState.moveY < 222 * ratio){
              this.setState({
                isCounting: false,
                circleCount: this.state.circleCount - 1,
                hours: this.state.hours - 1,
                rotation: this.setRotation(gestureState.moveX - window.width / 2, 222 * ratio - gestureState.moveY,gestureState.vx) + (this.state.circleCount - 1) * 360,
                minutes: Math.floor(this.state.rotation % 360 / 6),
              });
            }
            else
            {
              this.setState({
                isCounting: false,
                rotation: this.setRotation(gestureState.moveX - window.width / 2, 222 * ratio - gestureState.moveY,gestureState.vx) + this.state.circleCount * 360,
                minutes: Math.floor(this.state.rotation % 360 / 6),
              });
            }

            this.lastX = gestureState.moveX;
            this.lastY = gestureState.moveY;
          },
        });
        this._panResponderCancelPicker = PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: (event,gestureState) => {
            this.setState({
              showPicker: false,
            });
          }
        });
    },

    componentDidMount: function() {
      var { DeviceEventEmitter } = require('react-native');
      subscription = DeviceEventEmitter.addListener(
        MHPluginSDK.deviceStatusUpdatedEventName,
        (notification) => {
          console.log("Device status Refreshed! " + notification.eventName);
          // MHPluginSDK.getDevicePropertyFromMemCache(["isCounting","rotationThen"],(pairs) => {
          //   if(pairs.isCounting){
          //     this.setState({
          //       isCounting: pairs.isCounting,
          //       rotation: pairs.rotationThen - 0.6,
          //     });
          //   };
          // })

        }
      );

      // 预设
      if (this.props.hourFromNow > 0 || this.props.minuteFromNow > 0) {
        us_id = this.props.us_id;
        this.setState({
          isCounting: true,
          circleCount: this.props.hourFromNow,
	  hours: this.props.hourFromNow,
          minutes: this.props.minuteFromNow,
          rotation: this.props.minuteFromNow * 6 + this.props.hourFromNow * 360,
        });
      };
    },

    componentWillUnmount: function() {
      rows = [];
    },

    _onQuickSet: function(Rowdata){
      var that = this;
      function closure() {
        if(Rowdata.type == 1){
          that.setState({
            circleCount: 0,
            rotation:Rowdata.rotation,
            hours: 0,
            minutes: Math.floor(Rowdata.rotation % 360 / 6),
          });
        }else{
          that.setState({
            showPicker: true,
          });
          return;
        }
      }
      return closure;
    },
    //判断当前年份是否闰年
    isLeapYear: function (Year) {
      if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)) {
      return true;
      } else { return false; }
    },
    //判断倒计时后日期是否跨月
    isCrossMonth: function(month,date){
      if(date <= 28){
        return false;
      };
      if(month == 2){
        var currentDate = new Date();
        if((date > 28 && !this.isLeapYear(currentDate.getFullYear())) ||  (date > 29 && this.isLeapYear(currentDate.getFullYear()))){
          return true;
        }else{return false;}
      }else if(month == 4 || month == 6 || month == 9 || month == 11){
        if(date > 30){return true;}
      }else{
        if(date > 31){return true;}
      };
      return false;
    },
    setTime: function(isCountDown){
      var currentDate = new Date();
      var setedMin = isCountDown ? currentDate.getMinutes() + this.state.minutes : currentDate.getMinutes();
      var setedHour = isCountDown ? currentDate.getHours() + this.state.hours : currentDate.getHours();
      var setedDate = currentDate.getDate();
      var setedDay = currentDate.getDay();
      var setedMonth = currentDate.getMonth() + 1;
      if(setedMin >= 60){
        setedMin -= 60;
        setedHour ++;
      };
      if(setedHour >= 24){
        setedHour -= 24;
        setedDay ++;
        setedDate ++;
      };
      if(setedDay > 6){
        setedDay = setedDay % 7;
      };
      if(this.isCrossMonth(setedMonth,setedDate)){
        setedDate = 1;
        setedMonth++;
      };
      if(setedMonth > 12){
        setedMonth == 1;
      };

      var setedString = setedMin + " " + setedHour + " " + setedDate + " " + setedMonth + " *";

      return setedString;
    },
    _onConfirm: function() {
      if(this.state.rotation == 0){
        return;
      };
      var pickerData;
      if(this.props.currentState == 'on'){
        pickerData = {
          "us_id": 0,
          "identify": this.state.did,
          "name": "青米智能插排",
          "st_id": "8",
          "setting": {
            "enable_timer": "1",
            "on_time": this.setTime(false),
            "enable_timer_on": "0",
            "off_time": this.setTime(true),
            "enable_timer_off": "1",
            "on_method": "set_power",
            "off_method": "set_power",
            "on_param": "on",
            "off_param": "off",
          },
          "authed": [this.state.did],
          "did": this.state.did,
        }
      }else{
        pickerData = {
          "us_id": 0,
          "identify": this.state.did,
          "name": "青米智能插排",
          "st_id": "8",
          "setting": {
            "enable_timer": "1",
            "on_time": this.setTime(true),
            "enable_timer_on": "1",
            "off_time": this.setTime(false),
            "enable_timer_off": "0",
            "on_method": "set_power",
            "off_method": "set_power",
            "on_param": "on",
            "off_param": "off",
          },
          "authed": [this.state.did],
          "did": this.state.did,
        }
      }

      MHPluginSDK.showLoadingTips("正在设置");
      MHPluginSDK.callSmartHomeAPI('/scene/edit', pickerData, (response) => {
         console.log(""+JSON.stringify(response));
         MHPluginSDK.dismissTips();
         if (response.code == undefined || response.code == 0) {
           us_id = response.result.us_id;
          this.setState({
            isCounting: true,
            showPicker: false,
          });
         }
         else {
           MHPluginSDK.showFailTips("设置失败");
         }
      });
    },
    _onCancel: function(){
      var delDate = {
        'us_id': us_id,
      }
      MHPluginSDK.showLoadingTips("正在设置");
      MHPluginSDK.callSmartHomeAPI('/scene/delete', delDate, (response) => {
        MHPluginSDK.dismissTips();
        console.log(""+JSON.stringify(response));
        if (response.code == undefined || response.code == 0) {
          this.setState({
            isCounting: false,
          });
        }
        else {
          MHPluginSDK.showFailTips("设置失败");
        }
      });
    },
    render: function() {
      var buttons,
          pointer;
      if (rows.length == 0)
      {
        for (var i=0; i < 360; i+=2)
        {
            rows.push(<Shape ref={"line_"+i} key={i} d={LINE_PATH} opacity={0.5} transform={new Transform().rotate(i,window.width / 2, 222 * ratio)} stroke="#FFFFFF" strokeWidth={1} />);
        }
      }
      else {
        console.log(""+this.state.rotation);
        for (var i=0; i < 360; i+=2)
        {
          var o = this.refs["line_"+i].props.opacity;
          if (((i<this.state.rotation) && (o == 1.0))||((i>=this.state.rotation)&& (o==0.5)))
          {

          }
          else {
            rows[i/2] = (<Shape ref={"line_"+i} key={i} d={LINE_PATH} opacity={i<this.state.rotation?1:0.5} transform={new Transform().rotate(i,window.width / 2, 222 * ratio)} stroke="#FFFFFF" strokeWidth={1} />);
          }
        }
      }
      if(this.state.isCounting){
        buttons = (
          <TouchableHighlight underlayColor='#E4E4E4' style={styles.confirm} onPress={this._onCancel}>
            <Text style={styles.confirmText}>取消</Text>
          </TouchableHighlight>
        );
        pointer = (
          <View style={styles.pointerContainer} {...this._panResponder.panHandlers} >
          <View>
          <Image style={styles.triangle} source={this.props.app.sourceOfImage('count_down_timer_thumb_on.png')} resizeMode='contain'/>
          </View>
          </View>
        );
      }else{
        buttons = (
          <TouchableHighlight underlayColor='#E4E4E4' style={styles.confirm} onPress={this._onConfirm}>
            <Text style={styles.confirmText}>启动</Text>
          </TouchableHighlight>
        );
        pointer = (
          <View style={styles.pointerContainer} {...this._panResponder.panHandlers} >
          <Image style={styles.pointer} source={this.props.app.sourceOfImage('count_down_timer_thumb_off.png')}/>
          </View>
        );
      };

      return (
        <Image  style={styles.background} source={this.props.app.sourceOfImage('on_background.png')} resizeMode='stretch'>
          <View style = {[{width: window.width},styles.top]}>
            <Text style={styles.centerText}>{this.state.hours}小时{this.state.minutes}分钟后{this.props.currentState == 'on'? '关闭' : '开启'}</Text>
            <Surface width={window.width} height={427.536 * ratio} style={styles.surface}  >
            <Group>
              {rows}
            </Group>
            </Surface>
            <View style={{position: 'absolute',top: 92 * ratio, width:window.width, height:260 * ratio,transform: [{rotate: this.state.rotation+'deg'}]}}>
              {circle}
              {pointer}
            </View>
          </View>
          <View style = {[{width: window.width},styles.bottom]}>
            <ListView style={styles.list} automaticallyAdjustContentInsets={false} dataSource={this.state.dataSource}
            renderRow={(rowData) => <TouchableHighlight underlayColor='#E4E4E4' style={styles.item} onPress={this._onQuickSet(rowData).bind(this)}><Text style={styles.listText}>{rowData.text}</Text></TouchableHighlight>}
            />
            <View style={styles.button}>
              {buttons}
            </View>
          </View>
          <View style={[styles.pickerCover,{top: this.state.showPicker? 0 : 9999}]}>
                      <View style={styles.pickerTop} {...this._panResponderCancelPicker.panHandlers}></View>
                      <View style={styles.pickerBottom}>
                        <View style={styles.pickerContainer}>
                          <PickerIOS
                            selectedValue={this.state.showPicker? this.state.hours:0}
                            onValueChange={(val) => this.setState({hours: val,rotation: val * 360 + this.state.minutes * 6})}
                            style={styles.picker}
                            >
                            {pickHour.map((item) => (
                              <PickerItemIOS key={item.label}
                                value={item.value}
                                label={item.label}
                              />
                            ))
                            }
                          </PickerIOS>
                          <Text style={styles.pickerText}>时</Text>

                          <PickerIOS
                            selectedValue={this.state.showPicker? this.state.minutes:0}
                            onValueChange={(val) => this.setState({minutes: val,rotation: this.state.hours * 360 + val * 6})}
                            style={styles.picker}
                            >
                            {pickMinutes.map((item) => (
                              <PickerItemIOS key={item.label}
                                value={item.value}
                                label={item.label}
                              />
                            ))
                            }
                          </PickerIOS>
                          <Text style={styles.pickerText}>分</Text>
                      </View>
                        <TouchableHighlight underlayColor='#E4E4E4' style={styles.pickerConfirm} onPress={this._onConfirm}>
                          <Text style={styles.confirmText}>启动</Text>
                        </TouchableHighlight>
                      </View>
            </View>
        </Image>
      );
    },
  });

  var route = {
    key: 'CountDown',
    title: "倒计时",
    component: CountDown,
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
    component: CountDown,
    route: route,
  }
