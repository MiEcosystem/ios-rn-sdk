'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
  TouchableWithoutFeedback
} = React;
import Chart from '../CommonModules/Chart/Chart.js';//注意不可以用下面那种方式；
// var Chart = require('../CommonModules/Chart/Chart');
var MHPluginSDK = require('NativeModules').MHPluginSDK;
var window = Dimensions.get('window');
const RATIO = window.width / 375.0;
const TITLES = ['时', '日', '月'];
const BAR_WIDTH = 30;//柱的宽度
const X_AXIS_WIDTH = 60;//x轴坐标的宽度
const CHART_LEFT = -30;//之所以设置为-30，是为了不显示y轴坐标

class PowerCostPage extends React.Component{

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedIndex: 0,
      dataPoint: 0,
      hourData: [],
      dayData: [],
      monthData: [],
    };
  }

  componentDidMount() {
    this._requestHourData();
    this._requestDayData();
    this._requestMonthData();
  }

  render() {
    //tabbar
    var tabbarItems = [];
    for (var i = 0; i < TITLES.length; i++) {
      var tempColor = this.state.selectedIndex == i ? '#90bee4aa' : 'transparent';
      var tabbarItem = (
        <TouchableWithoutFeedback key={i} onPressIn={this._generateOnClickedFunction(i).bind(this)}>
          <View style={[styles.tabbarItem,{backgroundColor:tempColor}]}>
            <Text style={{color:'#f0f0f0bb'}}>{TITLES[i]}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
      tabbarItems.push(tabbarItem);
    }

    var powerCostList = [this.state.hourData, this.state.dayData, this.state.monthData];
    var currentData = powerCostList[this.state.selectedIndex];
    var chartWidth = X_AXIS_WIDTH * currentData.length;
    if (chartWidth < window.width - CHART_LEFT) {
      chartWidth =  window.width - CHART_LEFT;
    }
    var contentOffsetX = chartWidth - (window.width - CHART_LEFT);//让scrollView滑到右边
    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <View style={styles.tabbarContainer}>
          <View style={{flex:1}} />
          {tabbarItems}
        </View>
        <ScrollView
          horizontal={true}
          bounces={false}
          contentInset={{top:0, left:0, bottom:0, right:CHART_LEFT}}
          contentOffset={{x:contentOffsetX, y:0}}
          showsHorizontalScrollIndicator={false} >
          <Chart
            style={[styles.chart, {width: chartWidth}]}
            data={currentData}
            verticalGridStep={2}
            type="bar"
            color="#90bee4"
            showGrid={false}
            axisColor='transparent'
            barWidth={BAR_WIDTH}
            onDataPointPress={this._onDataPointPress.bind(this)}
           />
         </ScrollView>
        <View style={styles.bottom}>
          <Text style={[styles.fontBase, {fontSize:30, marginBottom:6}]}>{this.state.dataPoint}</Text>
          <Text style={[styles.fontBase, {fontSize:14}]}>{TITLES[this.state.selectedIndex]+'用电量(单位:KWH)'}</Text>
        </View>
      </View>
    );
  }

  _generateOnClickedFunction(index) {
    var powerCostList = [this.state.hourData, this.state.dayData, this.state.monthData];
    var currentData = powerCostList[this.state.selectedIndex];
    var that = this;
    return function() {
      that.setState({
        selectedIndex: index,
        dataPoint: currentData[0][1],
      });
    }
  }

  _onDataPointPress(e, dataPoint, index) {
    this.setState({
      dataPoint: dataPoint,
    });
  }


  _requestHourData() {
    var now = new Date();
    var endTime = now.getTime()/1000;//返回自1970以来至今的毫秒数;
    var timeInterval = (now.getUTCHours()+8)*60*60 + now.getUTCMinutes()*60 + now.getUTCSeconds();
    var startTime = endTime - timeInterval;
    var params = {
      did: MHPluginSDK.deviceId,
      time_start: startTime,
      time_end: endTime,
      limit: 1000,
      type: 'store',
      key: 'powerCost',
      group: 'hour',
    };
    MHPluginSDK.callSmartHomeAPI('/user/get_user_device_data', params, (response) => {
      if (response.message == 'ok') {
        var hourData = [];
        var list = JSON.parse(response.result[0].value);//把JSON字符串转换为对象;
        var date = new Date();
        for (var i = 1; i < list.length; i++) {
          var tempArray = list[i].split(",");
          date.setTime(tempArray[0]*1000);
          var time = date.getUTCHours()+8;
          if (time >= 24) {
            time -= 24;
          }
          var powerValue = tempArray[1];
          hourData.push([time+':00', powerValue]);
        }
      }
      this.setState({
        hourData: hourData,
      });
    });
  }

  _requestDayData() {
    var now = new Date();
    var endTime = now.getTime()/1000;//返回自1970以来至今的毫秒数;
    var timeInterval = 30*24*3600;//30天的时间;
    var startTime = endTime - timeInterval;
    var params = {
      did: MHPluginSDK.deviceId,
      time_start: startTime,
      time_end: endTime,
      limit: 1000,
      type: 'store',
      key: 'powerCost',
      group: 'day',
    };
    MHPluginSDK.callSmartHomeAPI('/user/get_user_device_data', params, (response) => {
      if (response.message == 'ok') {
        var dayData = [];
        var list = JSON.parse(response.result[0].value);//把JSON字符串转换为对象;
        var date = new Date();
        for (var i = 1; i < list.length; i++) {
          var tempArray = list[i].split(",");
          date.setTime(tempArray[0]*1000);
          var powerValue = tempArray[1];
          dayData.push([date.getUTCMonth()+1+'月'+date.getUTCDate()+'日', powerValue]);
        }
      }
      this.setState({
        dayData: dayData,
      });
    });
  }

  _requestMonthData() {
    var now = new Date();
    var endTime = now.getTime()/1000;//返回自1970以来至今的毫秒数;
    var timeInterval = 365*24*3600;//365天的时间;
    var startTime = endTime - timeInterval;
    var params = {
      did: MHPluginSDK.deviceId,
      time_start: startTime,
      time_end: endTime,
      limit: 1000,
      type: 'store',
      key: 'powerCost',
      group: 'month',
    };
    MHPluginSDK.callSmartHomeAPI('/user/get_user_device_data', params, (response) => {
      if (response.message == 'ok') {
        var monthData = [];
        var list = JSON.parse(response.result[0].value);//把JSON字符串转换为对象;
        var date = new Date();
        for (var i = 1; i < list.length; i++) {
          var tempArray = list[i].split(",");
          date.setTime(tempArray[0]*1000);
          var powerValue = tempArray[1];
          monthData.push([date.getUTCFullYear()+'年'+(date.getUTCMonth()+1)+'月', powerValue]);
        }
      }
      this.setState({
        monthData: monthData,
      });
    });
  }

}


const tabbarContainerHeight = 202 * RATIO;
const bottomHight = 112 * RATIO;
const chartHeight = window.height - tabbarContainerHeight - bottomHight;

var styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#267dca',
    },
    tabbarContainer: {
      top: 0,
      width: window.width,
      height: tabbarContainerHeight,
      paddingTop: 82,
      // alignItems: 'center',
      flexDirection: 'row',
    },
    tabbarItem: {
      marginRight: 16 * RATIO,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#90bee455'
    },
    chart: {
      left: CHART_LEFT,//隐藏掉y轴方向的坐标，调用api无法做到隐藏y轴同时保留x轴；
      width: window.width - CHART_LEFT,
      height: chartHeight,
      // borderWidth: 1,
    },
    bottom: {
      width: window.width,
      height: bottomHight,
      backgroundColor: '#f0f0f0ee',
      justifyContent: 'center',
      alignItems: 'center',
    },
    fontBase: {
      textAlign: 'center',
      color: '#000000ee',
      opacity: 0.9,
    }
});


var route = {
    key: 'PowerCostPage',
    title: '电量统计',
    navLeftButtonStyle: {
        tintColor:'#ffffff',
    },
    navTitleStyle: {
        color:'#ffffff',
        top: 3,
    },
    navBarStyle: {
        backgroundColor:'transparent',
    },
    isNavigationBarHidden: false,
    component: PowerCostPage,
};

module.exports = {
  component: PowerCostPage,
  route: route,
}
