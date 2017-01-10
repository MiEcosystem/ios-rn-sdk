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
var AnimFadeInOutDemo = require('./AnimationComponentDemo/AnimFadeInOutDemo');//淡入淡出
var AnimTransformDemo = require('./AnimationComponentDemo/AnimTransformDemo');//旋转翻转
var AnimTranslationDemo = require('./AnimationComponentDemo/AnimTranslationDemo');//平行移动
var AnimEffectsDemo = require('./AnimationComponentDemo/AnimEffectsDemo');//动画特效
var AnimEventsDemo = require('./AnimationComponentDemo/AnimEventsDemo');//动画事件
var LayoutAnimationDemo = require('./AnimationComponentDemo/LayoutAnimationDemo'); //其他动画
var AnimCustomCompDemo = require('./AnimationComponentDemo/AnimCustomCompDemo'); //自定义动画组件

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

class AnimationPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([AnimFadeInOutDemo, AnimTransformDemo,
        AnimTranslationDemo, AnimEffectsDemo, AnimEventsDemo, LayoutAnimationDemo, AnimCustomCompDemo])
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
  key: 'AnimationPage',
  title: 'Animations Demo',
  component: AnimationPage,
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
  component: AnimationPage,
  route: route,
}
