'use strict';

var React = require('react-native');
var ActionSheetIOS = require('ActionSheetIOS');
var HelloDeveloper = require('../CommonModules/HelloDeveloper');
var HelloReactART = require('../CommonModules/HelloReactART');
var NewStructureTest = require('./NewStructureTest');
var ScreenShot = require('./ScreenShot');
var MultiLanguage = require('./MultiLanguage');
var {
  StyleSheet,
  Text,
  ListView,
  View,
  Image,
  TouchableHighlight,
  Component,
  StatusBar,
} = React;

var MHPluginSDK = require('NativeModules').MHPluginSDK;

var BUTTONS = [
  '测试对话框',
  '确定',
];

class MoreMenu extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2)=>r1!==r2
    });
    this._createMenuData();
    this.state = {
      dataSource: ds.cloneWithRows(this._menuData.map((o)=>(o.name))),
    };
  }

  _createMenuData() {
    var commonMenuData = [];
    if (MHPluginSDK.ownerId == MHPluginSDK.userId) // 非分享设备
    {
      commonMenuData = [
        {
          'name': '修改设备名称',
          'func': () => {
            MHPluginSDK.openChangeDeviceName();
          }
        },
        {
          'name': '设备共享',
          'func': () => {
            MHPluginSDK.openShareDevicePage();
          }
        },
        {
          'name': '检查固件升级',
          'func': () => {
            MHPluginSDK.openDeviceUpgradePage();
          }
        },
        {
          'name': '解除连接',
          'func': () => {
            MHPluginSDK.openDeleteDevice();
          }
        },
        {
          'name': '反馈',
          'func': () => {
            MHPluginSDK.openFeedback();
          }
        },
        {
          'name': '截图',
          'func': () => {
            this.screenShot();
          }
        },
      ];
    }

    var specificMenuData = [
      {
        'name': '你好，开发者！',
        'func': () => {
          this.onShowDidButtonPress();
        }
      },
      {
        'name': '弹出Alert',
        'func': () => {
        	alert('测试对话框');
        }
      },
      {
        'name': '弹出ActionSheet',
        'func': () => {
          this.showActionSheet();
        }
      },
      {
        'name': 'REACT-ART',
        'func': () => {
          this.showReactART();
        }
      },
      {
        'name': '多语言测试',
        'func': () => {
          this.showMultiLanguage();
        }
      },
      {
        'name': '分享',
        'func': () => {
          MHPluginSDK.openShareListBar("小米智能家庭", "小米智能家庭", "about_icon_app", "http://open.home.mi.com");
          // 分享到微信
          //        MHPluginSDK.shareToWeChatSession("小米智能家庭", "小米智能家庭", this.props.app.pathForResource("icon_demo.png"), null);
          // 分享到微博
          //        MHPluginSDK.shareToWB("小米智能家庭", "小米智能家庭", "about_icon_app", null);
          // 分享到米聊
          //        MHPluginSDK.shareToML("小米智能家庭", "小米智能家庭", this.props.app.pathForResource("icon_demo.png"), "http://open.home.mi.com");
          // 分享到朋友圈
          //        MHPluginSDK.shareToWeChatMoment("小米智能家庭", "小米智能家庭", this.props.app.pathForResource("icon_demo.png"), "http://open.home.mi.com");
        }
      },
      {
        'name':'新目录结构获取图片方式测试',
        'func':() =>{
          this.props.navigator.push(NewStructureTest.route);
        }
      },
    ];
    this._menuData = commonMenuData.concat(specificMenuData);
  }

  render() {
    return (
        <View style={styles.container}>
          <StatusBar barStyle='default' />
          <ListView style={styles.list} dataSource={this.state.dataSource} renderRow={this._renderRow.bind(this)} />
        </View>
    );
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight underlayColor='#838383' onPress={() => this._pressRow(rowID)}>
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.title}>{rowData}</Text>
            <Image style={styles.subArrow} source={this.props.app.sourceOfImage("sub_arrow.png")} />
          </View>
          <View style={styles.separator}></View>
        </View>
      </TouchableHighlight>
    );
  }

  _pressRow(rowID) {
    console.log("row"+rowID+"clicked!");
    this._menuData[rowID].func();
  }

  onShowDidButtonPress() {
    this.props.navigator.push(HelloDeveloper.route);
  }

  showReactART() {
    this.props.navigator.push(HelloReactART.route);
  }

  showMultiLanguage(){
    this.props.navigator.push(MultiLanguage.route);
  }
  screenShot(){
    this.props.navigator.push(ScreenShot.route);
  }
  showActionSheet() {
    ActionSheetIOS.showActionSheetWithOptions({
          options: BUTTONS,
          destructiveButtonIndex: 1,
          },
          (buttonIndex) => {

          });
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 0,
    marginTop: 64,
  },

  rowContainer: {
  	alignSelf: 'stretch',
    flexDirection: 'row',
    flex: 1,
    padding: 20
  },
  list: {
    alignSelf: 'stretch',
  },

  title: {
    fontSize: 17,
    alignItems: 'center',
    flex: 1,
  },
  subArrow: {
     width: 9,
     height: 18,
  },
  separator: {
  	height: 1,
  	backgroundColor: '#dddddd',
  	marginLeft: 20,
  	marginRight: 20
  }
});

var route = {
  key: 'MoreMenu',
  title: '设置',
  component: MoreMenu,
  renderNavRightComponent: function(route, navigator, index, navState) {
    return (<View />);
  },
}

module.exports = {
  component: MoreMenu,
  route: route,
}
