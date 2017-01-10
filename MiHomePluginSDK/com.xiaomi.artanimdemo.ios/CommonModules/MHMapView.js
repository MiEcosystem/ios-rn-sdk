// MHMapView.js
var React = require('react-native');
var { requireNativeComponent } = React;

class MHMapView extends React.Component {
  render() {
    return <MHWrapperMapView {...this.props} />;
  }
}

MHMapView.propTypes = {
  distanceFilter: React.PropTypes.number,
  zoomLevel: React.PropTypes.number,
  showsUserLocation: React.PropTypes.bool,
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
  //scaleOrigin包含x和y两个key
  scaleOrigin: React.PropTypes.object,
  showsScale: React.PropTypes.bool,
  //compassOrigin包含x和y两个key
  compassOrigin: React.PropTypes.object,
  showsCompass: React.PropTypes.bool,
  // annotations: React.PropTypes.array,
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
};

var MHWrapperMapView = requireNativeComponent('MHWrapperMapView', MHMapView);
module.exports = MHMapView;
