import React, { Component, PropTypes, View } from 'react';
import { requireNativeComponent } from 'react-native';
var findNodeHandle = require('findNodeHandle');

var MHWarpperImageBrowserManager = require('NativeModules').MHWarpperImageBrowser;

class MHImageBrowserIOS extends Component {
    render() {
        return (
            <MHWarpperImageBrowser {...this.props}
              ref={browser => this._browser = browser}
            />
        );
    }

    setBrowserCurrentImageIndex(index){

      MHWarpperImageBrowserManager.setBrowserCurrentImageIndex(findNodeHandle(this._browser),index);
    }
};

MHImageBrowserIOS.propTypes = {
   currentIndex: React.PropTypes.number,
   itemWidth: React.PropTypes.number,
   itemHeight: React.PropTypes.number,
   itemSpacing: React.PropTypes.number,
   itemSelectedWidth: React.PropTypes.number,
   itemSelectedHeight: React.PropTypes.number,
   imageBrowserHeight: React.PropTypes.number,
   backAlpha: React.PropTypes.number,
   onDidChangeAtIndex: React.PropTypes.func,
   onDidSelectAtIndex: React.PropTypes.func,
};

 MHImageBrowserIOS.defaultProps = {
  itemWidth: 60.0,
  itemHeight: 85.0,
  itemSpacing: 25.0,
  itemSelectedWidth: 75.0,
  itemSelectedHeight: 108.0,
  imageBrowserHeight: 125.0,
  backAlpha: 0.6,
};

MHImageBrowserIOS.nativeOnly = {

};

var MHWarpperImageBrowser = requireNativeComponent('MHWarpperImageBrowser', MHImageBrowserIOS);


class MHImageBrowser extends Component {
    render() {
        return (
            <MHImageBrowserIOS {...this.props}
              ref = {browser => this._browser = browser}
              onDidChangeAtIndex={(event) => this._indexDidChange(event)}
              onDidSelectAtIndex={(event) => this._indexDidSelect(event)} />
        );
    }
    _indexDidChange(event) {
      if (this.props.onIndexDidChange) {
        this.props.onIndexDidChange(event.nativeEvent.index);
      }
    }

    _indexDidSelect(event) {
      if (this.props.onIndexDidSelect) {
        this.props.onIndexDidSelect(event.nativeEvent.index);
      }
    }

    setCurrentImageIndex(index){
        this._browser.setBrowserCurrentImageIndex(index);
    }
};

MHImageBrowser.propTypes = {
  ...MHImageBrowserIOS.propTypes,
  onIndexDidChange: React.PropTypes.func,
  onIndexDidSelect: React.PropTypes.func,
}

module.exports = MHImageBrowser;
