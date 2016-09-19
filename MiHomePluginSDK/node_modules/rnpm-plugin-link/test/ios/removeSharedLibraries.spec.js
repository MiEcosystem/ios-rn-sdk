const chai = require('chai');
const expect = chai.expect;
const xcode = require('xcode');
const addSharedLibraries = require('../../src/ios/addSharedLibraries');
const removeSharedLibraries = require('../../src/ios/removeSharedLibraries');
const getGroup = require('../../src/ios/getGroup');

const project = xcode.project('test/fixtures/project.pbxproj');

describe('ios::removeSharedLibraries', () => {

  beforeEach(() => {
    project.parseSync();
    addSharedLibraries(project, ['libc++.tbd', 'libz.tbd']);
  });

  it('should remove only the specified shared library', () => {
    removeSharedLibraries(project, ['libc++.tbd']);

    const frameworksGroup = getGroup(project, 'Frameworks');
    expect(frameworksGroup.children.length).to.equal(1);
    expect(frameworksGroup.children[0].comment).to.equal('libz.tbd');
  });

  it('should ignore missing shared libraries', () => {
    removeSharedLibraries(project, ['libxml2.tbd']);

    const frameworksGroup = getGroup(project, 'Frameworks');
    expect(frameworksGroup.children.length).to.equal(2);
  });

});
