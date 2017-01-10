'use strict';
var React = require('react-native');
var {
  Dimensions
} = React;

var {height, width} = Dimensions.get('window');

var MHAutoSizeScale = {
  //iphone 6 plus 物理版
  AutosizeScale1080x1920: width/1080.0,
  //iphone 6 plus 设计版
  AutosizeScale1242x2208: width/1242.0,
  //iphone 6
  AutosizeScale750x1334: width/750.0,
  //iphone 5 ／ touch / iphone 4s (4s 的长宽比于5 6 6p 不同，则按5来计算)
  AutosizeScalePX640x1136: width/640.0,
}

module.exports = MHAutoSizeScale;
