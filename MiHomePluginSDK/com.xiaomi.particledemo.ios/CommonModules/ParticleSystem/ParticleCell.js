/*
*/
'use strict';

var React = require('react-native');
var GPHParticleCell = React.NativeModules.GPHParticleCell;

var {
  ColorPropType
} = React;

class ParticleCell extends React.Component {

    static propTypes = {
      name                   : React.PropTypes.string,

      enabled                : React.PropTypes.bool,

      // a unit rectangle specifying the portion of the particle image to render
      contentsRect           : React.PropTypes.shape({ x: React.PropTypes.number, y: React.PropTypes.number, width: React.PropTypes.number, height: React.PropTypes.number}),

      magnificationFilter    : React.PropTypes.oneOf(["linear", "nearest"]),
      minificationFilter     : React.PropTypes.oneOf(["linear", "nearest"]),
      minificationFilterBias : React.PropTypes.number,

      scale                  : React.PropTypes.number,
      scaleRange             : React.PropTypes.number,
      scaleSpeed             : React.PropTypes.number,

      color                  : ColorPropType,
      redRange               : React.PropTypes.number,
      greenRange             : React.PropTypes.number,
      blueRange              : React.PropTypes.number,
      alphaRange             : React.PropTypes.number,

      // the rate at which the individaul color components can change
      redSpeed               : React.PropTypes.number,
      greenSpeed             : React.PropTypes.number,
      blueSpeed              : React.PropTypes.number,
      alphaSpeed             : React.PropTypes.number,

      // how long a particle exists in the system - specified in milliseconds
      lifetime               : React.PropTypes.number,
      lifetimeRange          : React.PropTypes.number,

      // how many particles are created each second
      birthRate              : React.PropTypes.number,

      velocity               : React.PropTypes.number,
      velocityRange          : React.PropTypes.number,

      xAcceleration          : React.PropTypes.number,
      yAcceleration          : React.PropTypes.number,
      zAcceleration          : React.PropTypes.number,

      spin                   : React.PropTypes.number,
      spinRange              : React.PropTypes.number,

      // expressed in radians - specifies the inital direction of a particle
      emissionLatitude       : React.PropTypes.number,
      emissionLongitude      : React.PropTypes.number,
      emissionRange          : React.PropTypes.number,

      beginTime              : React.PropTypes.number,
      // basic duration - in milliseconds
      duration               : React.PropTypes.number,

      // The rate of the layer. Used to scale parent time to local cell time/
      speed                  : React.PropTypes.number,

      // Additional offset in active local time. (ms)
      timeOffset             : React.PropTypes.number,

      // The repeat count of the cell. May be fractional.
      repeatCount            : React.PropTypes.number,
      repeatDuration         : React.PropTypes.number,
      autoreverses           : React.PropTypes.bool,

      // Defines how the timed cell behaves outside its active duration.
      fillMode               : React.PropTypes.oneOf(['backwards', 'forwards', 'both', 'removed'])
    };

    constructor(props) {
      super(props);
    }

    render() {
      var {color,
        ...otherProps} = this.props;
      color = React.processColor(color);

      return (
        <GPHParticleCell props={{color: color, ...otherProps}}/>
        );
    }
}

ParticleCell.defaultProps = {
    name                   : null,

    enabled                : false,

    color                  : 'white',

    lifetime               : 0,
    lifetimeRange          : 0,
    birthRate              : 0,

    emissionLatitude       : 0 * 2 * 3.14159,
    emissionLongitude      : 0 * 2 * 3.14159,
    emissionRange          : 0 * 2 * 3.14159,

    velocity               : 0,
    velocityRange          : 0,

    xAcceleration          : 0,
    yAcceleration          : 0,
    zAcceleration          : 0,

    scale                  : 1,
    scaleRange             : 0,
    scaleSpeed             : 0,

    spin                   : 0,
    spinRange              : 0,

    redRange               : 0,
    greenRange             : 0,
    blueRange              : 0,
    alphaRange             : 0,

    redSpeed               : 0,
    greenSpeed             : 0,
    blueSpeed              : 0,
    alphaSpeed             : 0,

    contentScale           : 1,
    contentsRect           : { x: 0, y: 0, width: 1, height: 1},

    magnificationFilter    : "linear",
    minificationFilter     : "linear",
    minificationFilterBias : 0,

    beginTime              : 0,
    duration               : 0,
    speed                  : 1,

    timeOffset             : 0,

    repeatCount            : 0,
    repeatDuration         : 0,
    autoreverses           : false,

    fillMode               : 'removed',
};

//module.exports = ParticleCell;

module.exports = React.requireNativeComponent('GPHParticleCell', null);
