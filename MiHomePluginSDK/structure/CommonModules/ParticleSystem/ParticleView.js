/*
*/
'use strict';

var React = require('react-native');

var {
  View
} = React;

class ParticleView extends React.Component {

  static propTypes = {
    emitterPosition:    React.PropTypes.shape({x:React.PropTypes.number, y:React.PropTypes.number}),
    emitterZPosition:   React.PropTypes.number,
    emitterShape:       React.PropTypes.oneOf(['point', 'line', 'rectangle', 'circle', 'cuboid', 'sphere']),
    emitterSize:        React.PropTypes.shape({width:React.PropTypes.number, height:React.PropTypes.number}),
    emitterMode:        React.PropTypes.oneOf(["points", 'outline', 'surface', 'volume']),

    // specifies the order the particles are rendered on the screen
    renderMode:         React.PropTypes.oneOf(["unordered", "oldestFirst", "oldestLast", "backToFront", "additive"]),
    emitterDepth:       React.PropTypes.number,
    preservesDepth:     React.PropTypes.bool,

    // the next five properties are multipliers of the ParticleCell's property with the same name
    // so a scale property of "2" would double the scale of all the enclosed ParticleCells
    birthRate:          React.PropTypes.number,
    lifetime:           React.PropTypes.number,
    velocity:           React.PropTypes.number,
    scale:              React.PropTypes.number,
    spin:               React.PropTypes.number,

    seed:               React.PropTypes.number,
    ...View.propTypes
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GPHParticleView {...this.props}></GPHParticleView>);
  }
}

ParticleView.defaultProps = {
  birthRate: 1,
  lifetime: 1,
  emitterPosition: {x:0, y:0},
  emitterZPosition: 0,
  emitterShape: 'point',
  emitterSize: {width:0, height:0},
  emitterMode: 'volume',
  renderMode: 'unordered',
  emitterDepth: 0,
  preservesDepth: false,
  velocity: 1,
  scale: 1,
  spin: 1,
  seed: 0
};

var GPHParticleView = React.requireNativeComponent('GPHParticleView', null);
module.exports = ParticleView;
