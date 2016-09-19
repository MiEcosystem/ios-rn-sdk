const chai = require('chai');
const expect = chai.expect;
const getDependencyConfig = require('../src/getDependencyConfig');
const sinon = require('sinon');

describe('getDependencyConfig', () => {
  it('should return an array of dependencies\' rnpm config', () => {
    const depenendencyConfig = {assets: []};
    const config = {
      getDependencyConfig: sinon.stub().returns(depenendencyConfig),
    };

    const depenendencies = getDependencyConfig(config, ['abcd']);
    expect(depenendencies).to.deep.equal([{name: 'abcd', config: depenendencyConfig}]);
    expect(config.getDependencyConfig.callCount).to.equals(1);
  });

  it('should filter out invalid react-native projects', () => {
    const config = {
      getDependencyConfig: sinon.stub().throws(new Error('Cannot require')),
    };

    expect(getDependencyConfig(config, ['abcd'])).to.deep.equal([]);
  });
});
