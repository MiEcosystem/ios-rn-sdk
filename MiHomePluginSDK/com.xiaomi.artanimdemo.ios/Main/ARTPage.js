'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  View,
  StatusBar,
  TouchableOpacity,
  Platform,
  DeviceEventEmitter,
  ListView,
  Dimensions
} = React;

var MHPluginSDK = require('NativeModules').MHPluginSDK;
var {height:screenHeight, width:screenWidth} = Dimensions.get('window');


//功能列表
var ARTSVGDemo = require('./ARTComponentDemo/ARTSVGDemo'); //图片：SVG，
var ARTRectDemo = require('./ARTComponentDemo/ARTRectDemo');//矩形：Rect，多边形：Polygon,多边线：Polyline
var ARTCircleDemo = require('./ARTComponentDemo/ARTCircleDemo');//圆形：Circle，
var ARTEllipseDemo = require('./ARTComponentDemo/ARTEllipseDemo');//椭圆：Ellipse
var ARTLineDemo = require('./ARTComponentDemo/ARTLineDemo');//直线：Line,多边线：Polyline
var ARTTextDemo = require('./ARTComponentDemo/ARTTextDemo');//文字：Text
var ARTGroupDemo = require('./ARTComponentDemo/ARTGroupDemo');//分组：Group,
var ARTGradientDemo = require('./ARTComponentDemo/ARTGradientDemo');//LinearGradient：线性渐变,RadialGradient：径向渐变
var ARTPatternDemo = require('./ARTComponentDemo/ARTPatternDemo');//Pattern 图案

//不支持的svg特性
//定义：Defs,复用：Use
//标记：Symbol,


const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class ARTPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        ARTLineDemo, ARTRectDemo, ARTCircleDemo, ARTEllipseDemo, ARTTextDemo, ARTGroupDemo, ARTGradientDemo, ARTPatternDemo, ARTSVGDemo])
    };
  }

  render() {
    return (
      <View style={styles.containerAll} >
        <StatusBar barStyle='light-content' />
        <View style={styles.listContainer}>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData) => this._createListCell(rowData)}
          />
        </View>
      </View>
    );
  }

  _createListCell(component){
    return (
      <TouchableHighlight onPress={this._onOpenSubPage(component).bind(this)}>
      <View style={styles.listCell}>
        <View style={styles.cellflex}>
          <Text style={styles.listText}>{component.route.title}</Text>
        </View>
        <View style={styles.cellfixed}>
          <Image style={styles.subArrow} source={this.props.app.sourceOfImage("sub_arrow.png")} />
        </View>
      </View>
      </TouchableHighlight>
    );
  }

  _onOpenSubPage(subPageComponent) {
    function subPage() {
      this.props.navigator.push({
        ...subPageComponent.route,
        passProps: {
          message: 'amazing!',
        },
      });
    }
    return subPage;
  }

  componentWillMount() {
    this._deviceNameChangedListener = DeviceEventEmitter.addListener(MHPluginSDK.deviceNameChangedEvent, (event) => {
      route.title = event.newName;
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this._deviceNameChangedListener.remove();
  }
}

var styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#838383',
    marginTop: 0,
  },
  listContainer: {
    marginTop: 64,
    height: screenHeight-64,
  },
  listCell:{
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#ffe4b5',
    borderWidth: 0.5,
    borderColor: 'white',
    padding: 12.5
  },
  cellflex: {
    flex: 1,
    height: 15,
  },
  cellfixed: {
    height: 15,
    width: 40,
  },
  listText: {
    color: '#1e1e2e',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'left',
  },
  subArrow: {
     width: 9,
     height: 15,
     marginRight: 15,
     alignSelf: 'center',
  },
});


// 每个页面export自己的route
var route = {
  key: 'ARTPage',
  title: "ART Demo",
  component: ARTPage,
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
  component: ARTPage,
  route: route,
}
