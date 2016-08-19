/**
 * Sample Particle System App

 */
'use strict';

import React, {
  AppRegistry,
  Text,
  View,
  Image,
  TabBarIOS,
  StyleSheet,
  Dimensions,
  PixelRatio
} from 'react-native';

var ParticleView = require('../CommonModules/ParticleSystem/ParticleView');
var ParticleCell = require('../CommonModules/ParticleSystem/ParticleCell');

class MHAirPurifierStarParticle extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this._createSpark()}
      </View>
    )
  }

  _createCellProps(){
    var cellV = {
      name: 'star',
      birthRate: 30.0,
      emissionLongitude: Math.PI,
      velocity: 50,
      velocityRange: 0,
      emissionRange: 0.0,
      yAcceleration: 0,
      scale: 0.4,
      lifetime: 1500,
      lifetimeRange: 500,
      scaleSpeed: -0.1,
      alphaSpeed: -0.3,
      color: 'white',
      contentsRect: [-5, 0, 10, 10],
      contentsScale: PixelRatio.get(),
    }
    return cellV;
  }

  _createSpark() {
    var midX = Dimensions.get('window').width/2;
    var midY = Dimensions.get('window').height/2;
    var particleCellProps = this._createCellProps();
    return(
      <View style={{flex:1, backgroundColor:'#46AA67'}}>
        <ParticleView name={"emitterLayer"}
          emitterPosition={{x:midX, y:midY}}
          emitterShape={'circle'}
          emitterMode={'outline'}
          emitterSize={{width:midX * 1.8, height:0}}
          renderMode={"backToFront"}>
          {
            <ParticleCell {...particleCellProps}>
              <Image source={require('../Resources/star.png')} />
            </ParticleCell>
          }
        </ParticleView>
      </View>
    );
  }
}

module.exports = MHAirPurifierStarParticle;
