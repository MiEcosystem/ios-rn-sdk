/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
'use strict';
const React = require('react-native');

const {
  NavigationExperimental,
  Navigator,
  AppRegistry,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
  StyleSheet,
  View,
  PixelRatio,
  DeviceEventEmitter,
} = React;

// NavigationExperimental目前还有bug，只能还是先用原来的navigator
// var Navigator = NavigationExperimental.LegacyNavigator;

var {height:screenHeight, widt:screenWidth} = Dimensions.get('window');
var ImageButton = require('../CommonModules/ImageButton');
var MijiaNavigationBar = require('../CommonModules/MijiaNavigationBar');
var MijiaPluginHelper = require('../CommonModules/MijiaPluginHelper');
var MijiaPluginSDK = require('../CommonModules/MijiaPluginSDK');

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

// 首页信息
var MainPage = require('./MainPage');
var SceneMain = require('./SceneMain');

class PluginApp extends React.Component {

  constructor(props) {
    super(props);

    if (MijiaPluginSDK.sceneInfo && (MijiaPluginSDK.sceneInfo.trigger || MijiaPluginSDK.sceneInfo.action) && SceneMain) { //自定义场景入口
      this._firstPage = SceneMain;
    }
    else { // 正常进入插件首页
      this._firstPage = MainPage;
    }

    var navigationBarRouteMapper = {
      LeftButton: function(route, navigator, index, navState) {
        if (route.renderNavLeftComponent) {
          return route.renderNavLeftComponent(route, navigator, index, navState);
        } else {
          var previousRoute = navState.routeStack[index - 1];
          return (
            <View style={{left:0, width:29+15*2, height:APPBAR_HEIGHT, justifyContent:'center', alignItems:'center'}}>
              <ImageButton
                source={{uri:MijiaPluginHelper.pathForResource("navi_back.png"), scale:PixelRatio.get()}}
                onPress={() => {
                  if (index === 0) {
                    MijiaPluginSDK.exitPlugin();
                  } else {
                    navigator.pop();
                  }
                }}
                style={[{width:29, height:29, tintColor: '#000000'}, route.navLeftButtonStyle]}
              />
            </View>
          );
        }
      }.bind(this),
      RightButton: function(route, navigator, index, navState) {
        if (route.renderNavRightComponent) {
          return route.renderNavRightComponent(route, navigator, index, navState);
        } else {
          return (<View />);
        }
      }.bind(this),
      Title: function(route, navigator, index, navState) {
        if (route.renderNavTitleComponent) {
          return route.renderNavTitleComponent(route, navigator, index, navState);
        } else {
          return (
            <Text style={[styles.navBarText, styles.navBarTitleText, route.navTitleStyle]}>
              {route.title}
            </Text>
          );
        }
      }.bind(this),
    };

    this.state = {
      navBarStyle: null,
      isNavigationBarHidden: false,
      navigationBarRouteMapper: navigationBarRouteMapper,
    }

  }

  componentWillMount() {
    var navigator = this.props.navigator;
    this._willFocusListener = DeviceEventEmitter.addListener('willfocus', (event) => {
      if (event.route)
      {
        this.setIsNavigationBarHidden(false);
        this.setIsNavigationBarHidden(event.route.isNavigationBarHidden);
        this.setNavigationBarStyle(event.route.navBarStyle);
        var navigationBarRouteMapper = {
          ...this.state.navigationBarRouteMapper,
        }
        // alert(""+JSON.stringify(navigationBarRouteMapper));
        // this.setState({navigationBarRouteMapper:navigationBarRouteMapper});
      }
    });
    this._didFocusListener = DeviceEventEmitter.addListener('didfocus', (event) => {

    });
  }

  componentDidMount() {
    DeviceEventEmitter.emit('willfocus', {route:this._firstPage.route()});
    DeviceEventEmitter.emit('didfocus', {route:this._firstPage.route()});
  }

  componentWillUnmount() {
    this._willFocusListener.remove();
    this._didFocusListener.remove();
  }

  render() {
    return (
      <Navigator
        debugOverlay={false}
        style={styles.appContainer}
        initialRoute={this._firstPage.route()}
        configureScene={(route, routeStack)=>({
          ...route.sceneConig || Navigator.SceneConfigs.FloatFromRight,
        })}
        onWillFocus={(route) => {
          DeviceEventEmitter.emit('willfocus', {route:route});
        }}
        onDidFocus={(route) => {
          DeviceEventEmitter.emit('didfocus', {route:route});
        }}
        renderScene={(route, navigator) => {
          if (route.component == undefined) {
            return <View />;
          }
          else {
            return <route.component navigator={navigator} app={this} {...route.passProps}/>
          }
        }}
        navigationBar={this.state.isNavigationBarHidden ? null :
          (<MijiaNavigationBar
            routeMapper={this.state.navigationBarRouteMapper}
            style={[styles.navBar, this.state.navBarStyle]}
          />)
        }
      />
    );
  }


  /**
    设置导航栏相关，子页面通过 this.props.app.xxx() 的方式调用
    */

  // 设置导航栏是否隐藏
  setIsNavigationBarHidden(isHidden) {
    this.setState({isNavigationBarHidden:isHidden});
  }

  // 设置导航栏背景样式
  setNavigationBarStyle(barStyle) {
    this.setState({navBarStyle:barStyle});
  }

}

var styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#373E4D',
    fontWeight: '500',
    fontSize: 18,
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  appContainer: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
  }
});

AppRegistry.registerComponent('com.xiaomi.sqlitedemo.ios', () => PluginApp);
