import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  StatusBar,
  Text,
  Modal,
  TouchableOpacity,
  Dimensions,
  View,
  ScrollView,
  TouchableHighlight,
  Navigator
} from 'react-native';

var {height:screenHeight, width:screenWidth} = Dimensions.get('window');

var Button = require('./Button');

class TestPage extends Component {
  constructor() {
    super();
  }
  _dismissView() {
    //推出
    this.props.navigator.pop();
  }

  render() {
    return (
          <View style={styles.container}>
            <Button
              onPress={this._dismissView.bind(this)}
              style={styles.button}>
              Close
            </Button>
            <Text style={styles.welcome}>
              Welcome to React Native Orientation Demo!
            </Text>
          </View>
    );
  }

}
const styles = StyleSheet.create({
  contentContainer: {
    height: 375,
    width: 667,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 3,
    backgroundColor: 'grey',
  },
  modalButton: {
    marginTop: 10,
  },
});

var route = {
  key: 'TestPage',
  title: '新屏幕旋转示例页面',
  component: TestPage,
};

module.exports = {
  component: TestPage,
  route: route,
}
