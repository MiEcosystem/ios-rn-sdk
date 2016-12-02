'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  Image,
  View,
  Component,
} = React;

var MijiaPluginHelper = require('../CommonModules/MijiaPluginHelper');

class HelloDeveloper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.containerAll}>
        <View style={styles.containerIcon}>
          <Image style={styles.icon} source={MijiaPluginHelper.sourceOfImage("hello_raise.jpg")} />
        </View>
        <View style={styles.containerText}>
          <Text style={styles.title}>你好，开发者{'\n\n'}
            终于等到你的到来，在小米智能硬件平台，您有机会创造出惊艳世界的智能产品。{'\n\n'}
            未来时智能化的时代，我们准备好了，你呢？
          </Text>
        </View>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  containerAll: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#838383',
    marginTop: 66,
  },
  containerIcon: {
    flex: 1.3,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
  },
  containerText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    alignSelf: 'stretch',
    padding: 20,
  },

  icon: {
    alignSelf: 'center',
    width: 152,
    height: 165,
  },

  title: {
    fontSize: 16,
    alignSelf: 'center',
  },

});

function route() {
  return {
    key: 'HelloDeveloper',
    title: 'Welcome!',
    component: HelloDeveloper,
  }
}

module.exports = {
  component: HelloDeveloper,
  route: route,
}
