const getGroup = require('./getGroup');

module.exports = function removeSharedLibraries(project, libraries) {
  const group = getGroup(project, 'Frameworks');

  if (!libraries.length || !group) {
    return;
  }

  const target = project.getFirstTarget().uuid;

  for (var name of libraries) {
    project.removeFramework(name, { target });
  }
};
