const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mock = require('mock-require');
const log = require('npmlog');
const path = require('path');

const unlink = require('../src/unlink');

log.level = 'silent';

describe('unlink', () => {

  beforeEach(() => {
    delete require.cache[require.resolve('../src/unlink')];
  });

  it('should reject when run in a folder without package.json', (done) => {
    const config = {
      getProjectConfig: () => {
        throw new Error('No package.json found');
      },
    };

    unlink(config, ['react-native-gradient']).catch(() => done());
  });

  it('should accept a name of a dependency to unlink', (done) => {
    const config = {
      getProjectConfig: () => ({ assets: [] }),
      getDependencyConfig: sinon.stub().returns({ assets: [], commands: {} }),
    };

    unlink(config, ['react-native-gradient']).then(() => {
      expect(
        config.getDependencyConfig.calledWith('react-native-gradient')
      ).to.be.true;
      done();
    }).catch(done);
  });

  it('should unregister native module when android/ios projects are present', (done) => {
    const unregisterNativeModule = sinon.stub();
    const dependencyConfig = {android: {}, ios: {}, assets: [], commands: {}};
    const config = {
      getProjectConfig: () => ({android: {}, ios: {}, assets: []}),
      getDependencyConfig: sinon.stub().returns(dependencyConfig),
    };

    mock(
      '../src/android/isInstalled.js',
      sinon.stub().returns(true)
    );

    mock(
      '../src/android/unregisterNativeModule.js',
      unregisterNativeModule
    );

    mock(
      '../src/ios/isInstalled.js',
      sinon.stub().returns(true)
    );

    mock(
      '../src/ios/unregisterNativeModule.js',
      unregisterNativeModule
    );

    const unlink = require('../src/unlink');

    unlink(config, ['react-native-blur']).then(() => {
      expect(unregisterNativeModule.calledTwice).to.be.true;
      done();
    }).catch(done);
  });

  it('should remove assets from dependency not used by project', (done) => {
    const dependencyAssets = ['Fonts/FontA.ttf', 'Fonts/FontB.ttf', 'Fonts/FontC.ttf'];
    const otherDependencyAssets = ['Fonts/FontB.ttf'];
    const projectAssets = ['Fonts/FontC.ttf', 'Fonts/FontD.ttf'];
    const getDependencyConfig = sinon.stub();
    const unlinkAssets = sinon.stub();

    getDependencyConfig.withArgs('react-native-blur').returns(
      {assets: dependencyAssets, commands: {}}
    );
    getDependencyConfig.returns(
      {assets: otherDependencyAssets, commands: {}}
    );

    const config = {
      getDependencyConfig,
      getProjectConfig: () => ({ios: {}, assets: projectAssets}),
    };

    mock(
      '../src/getProjectDependencies',
      () => ['react-native-blur', 'react-native-gradient']
    );

    mock(
      '../src/ios/unlinkAssets.js',
      unlinkAssets
    );

    const unlink = require('../src/unlink');

    unlink(config, ['react-native-blur']).then(() => {
      expect(unlinkAssets.calledOnce).to.be.true;
      expect(unlinkAssets.firstCall.args[0]).to.deep.equal(['Fonts/FontA.ttf']);
      done();
    }).catch(done);
  });

  afterEach(() => {
    mock.stopAll();
  });

});
