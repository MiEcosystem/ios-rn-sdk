// MHMapView.js
var React = require('react-native');
var { requireNativeComponent } = React;

class MHMapView extends React.Component {
  render() {
    return <MHWrapperMapView {...this.props} />;
  }
}

MHMapView.propTypes = {
  mapType: React.PropTypes.number,//0普通地图，1卫星地图
  distanceFilter: React.PropTypes.number,
  zoomLevel: React.PropTypes.number,
  showsUserLocation: React.PropTypes.bool,
  desiredAccuracy: React.PropTypes.number,
  allowsBackgroundLocationUpdates:React.PropTypes.bool,
  pausesLocationUpdatesAutomatically:React.PropTypes.bool,
  headingFilter:React.PropTypes.number,
  /*
  userTrackingMode对应native端的MAUserTrackingMode，具体如下：
    "none": MAUserTrackingModeNone,
    "follow": MAUserTrackingModeFollow,
    "followWithHeading": MAUserTrackingModeFollowWithHeading,
  */
  userTrackingMode: React.PropTypes.string,
  /*
  userLocation用于自定义用户位置图标；
    {image: string //图片的路径
    size: object //图片显示的大小，包含width和height两个key；
    centerOffset: object //图片中心点的偏移位置，包含x和y两个key；
    canShowCallout: bool //是否显示气泡，默认为true；
    enabled: bool //是否响应点击事件，默认为true；
    }
  */
  userLocation: React.PropTypes.object,

  /*
  {
    latitude: 40.000,
    longitude: 120.000,
  }
  */
  centerCoordinate: React.PropTypes.object,
  /*
  userLocationRepresentation用户修改用户图标样式
    {image: string //图片的路径；
    imageScale: number //图片scale；
    showsAccuracyRing: bool //是否显示精度圈。默认为YES；
    showsHeadingIndicator: bool //是否显示方向指示(MAUserTrackingModeFollowWithHeading模式开启)。默认为YES；
    lineWidth: number //精度圈边线宽度,默认是2；
    strokeColor: array //描边颜色，如[0.9, 0.1, 0.1, 0.9]；
    fillColor: array //填充颜色，如[0.9, 0.1, 0.1, 0.9]；
    }
  */
  userLocationRepresentation: React.PropTypes.object,
  //scaleOrigin包含x和y两个key
  scaleOrigin: React.PropTypes.object,
  showsScale: React.PropTypes.bool,
  //compassOrigin包含x和y两个key
  compassOrigin: React.PropTypes.object,
  showsCompass: React.PropTypes.bool,
  //是否可以调整zoomLevel
  zoomEnabled: React.PropTypes.bool,
  /*
  annotations为annotation组成的数组，每一个annotation的属性如下：
  id: string  //唯一标识
  title: string   //目标位置,点击图标弹出的title
  image: string //图片路径，如MHPluginSDK.basePath + 'map/002.png',
  size: object  //图片显示尺寸，如 {width: 64, height: 64},
  canShowCallout: bool//点击图标后是否显示气泡
  coordinate: object//坐标
  */
  annotations: React.PropTypes.array,
  polylines: React.PropTypes.array,
  multiPolylines: React.PropTypes.array,
  /*
  circles
    [{coordinate: object //中心点坐标，包含latitude和longitude两个key
    radius: number //圆圈半径，单位是米；
    strokeColor: array //描边颜色，如[0.9, 0.1, 0.1, 0.9]；
    fillColor: array //填充颜色，如[0.9, 0.1, 0.1, 0.9]；
    id: string //唯一标识；
    lineWidth: number //描边线的宽度，默认为1；
    }]
  */
  circles: React.PropTypes.array,
  // userLocationTitle: React.PropTypes.string,
  // userLocationSubtitle: React.PropTypes.string,

  //刷新用户位置信息的回调，返回坐标
  onUpdateUserLocation: React.PropTypes.func,
  //点击用户图标的回调，返回空
  onSelectAnnotationView: React.PropTypes.func,
  //单击事件的回调，返回坐标
  onSingleTappedAtCoordinate: React.PropTypes.func,
  //长按事件的回调，返回坐标
  onLongPressedAtCoordinate: React.PropTypes.func,
  onMapWillZoomByUser: React.PropTypes.func,
  onMapDidZoomByUser: React.PropTypes.func,
};

var MHWrapperMapView = requireNativeComponent('MHWrapperMapView', MHMapView);
module.exports = MHMapView;
