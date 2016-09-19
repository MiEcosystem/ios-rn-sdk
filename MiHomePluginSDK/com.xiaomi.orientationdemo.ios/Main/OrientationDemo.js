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

import Orientation from 'react-native-orientation';
var {height:screenHeight, width:screenWidth} = Dimensions.get('window');

var Button = require('./Button');
var TestPage = require('./TestPage');


class OrientationDemo extends Component {
  constructor() {
    super();
    const init = Orientation.getInitialOrientation();

    this.state = {
      init,
      or: init,
      sor: init,
      modalVisible: true,
    };
    this._updateOrientation = this._updateOrientation.bind(this);
    Orientation.addOrientationListener(this._updateOrientation);
    this._updateSpecificOrientation = this._updateSpecificOrientation.bind(this);
    Orientation.addSpecificOrientationListener(this._updateSpecificOrientation);
    Orientation.lockToLandscape();
  }

  _updateOrientation(or) {
    this.setState({ or });
  }

  _updateSpecificOrientation(sor) {
    this.setState({ sor });
  }
  _dismissView() {
    Orientation.lockToPortrait();

    this.props.navigator.pop();
  }

  _orientationDidChange(orientation) {
    if (orientation == 'LANDSCAPE') {
      console.log('目前屏幕方向是：横屏');
    } else {
      console.log('目前屏幕方向是：竖屏');
    }
  }

  componentWillMount() {
      var initial = Orientation.getInitialOrientation();
      if (initial === 'PORTRAIT') {
        //do stuff
      } else {
        //do other stuff
      }
  }
  componentDidMount() {
    //Orientation.lockToPortrait(); //this will lock the view to Portrait
    //Orientation.lockToLandscape(); //this will lock the view to Landscape
    //Orientation.unlockAllOrientations(); //this will unlock the view to all Orientations
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  componentWillUnmount() {
    Orientation.getOrientation((err,orientation)=> {
      console.log("Current Device Orientation: ", orientation);
    });

    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  _onOpenSubPageOnNewPageStack()
  {
    this._nav.push(TestPage.route);
  }
  render() {
    const { init, or, sor} = this.state;
    return (
        <Modal visible={this.state.modalVisible}>
          <Navigator
            ref={nav => this._nav = nav}
            initialRoute={{ title: 'My Initial Scene', index: 0 }}
            renderScene={(route, navigator) => {
                  if (route.component == undefined) {
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
                        <Text style={styles.instructions}>
                          {`Initial Orientation: ${init}`}
                        </Text>
                        <Text style={styles.instructions}>
                          {`Current Orientation: ${or}`}
                        </Text>
                        <Text style={styles.instructions}>
                          {`Specific Orientation: ${sor}`}
                        </Text>
                        <TouchableOpacity
                          onPress={Orientation.unlockAllOrientations}
                          style={styles.button}
                        >
                          <Text style={styles.instructions}>
                            Unlock All Orientations
                          </Text>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            onPress={Orientation.lockToPortrait}
                            style={styles.button}
                          >
                            <Text style={styles.instructions}>
                              Lock To Portrait
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => this._onOpenSubPageOnNewPageStack()}
                            style={styles.button}
                          >
                            <Text style={styles.instructions}>
                               Push New Page
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity
                            onPress={Orientation.lockToLandscapeLeft}
                            style={styles.button}
                          >
                            <Text style={styles.instructions}>
                              Lock To Left
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={Orientation.lockToLandscape}
                            style={styles.button}
                          >
                            <Text style={styles.instructions}>
                              Lock To Landscape
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={Orientation.lockToLandscapeRight}
                            style={styles.button}
                          >
                            <Text style={styles.instructions}>
                              Lock To Right
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }
                  else {
                    return <route.component navigator={navigator} app={this} {...route.passProps}/>
                  }
              }
            }
          />
      </Modal>
    );
  }

}
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    height: screenWidth - 49,
    width: screenHeight,
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
  key: 'OrientationDemo',
  title: '屏幕旋转示例',
  component: OrientationDemo,
};

module.exports = {
  component: OrientationDemo,
  route: route,
}
