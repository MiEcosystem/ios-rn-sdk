'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  View,
  TextInput,
  PixelRatio,
  DeviceEventEmitter,
  StatusBar,
  TouchableOpacity,
  Component,
} = React;

var MHPluginSDK = require('NativeModules').MHPluginSDK;

import Chart from "../CommonModules/Chart/Chart.js";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    chart: {
        width: 300,
        height: 600,
    },
});

const data = [
    [0, 1],
    [1, 2],
    [2, 4],
    [3, 8],
    [4, 16],
];

class ChartDemo extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Chart
                    style={styles.chart}
                    data={data}
                    verticalGridStep={2}
                    type="bar"
                    color="#ff0000"
                    lineWidth={4}
                 />
            </View>
        );
    }
}

var route = {
  key: 'ChartDemo',
  title: '图表示例',
  component: ChartDemo,
};

module.exports = {
  component: ChartDemo,
  route: route,
}
