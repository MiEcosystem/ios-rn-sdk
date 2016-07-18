"use strict";

var pickReactFirstChild = require("./pickReactFirstChild");

module.exports = function unfoldGLComponent(c, context, glComponentNameArray) {
  var Class = c.type;
  if (!Class.isGLComponent) return;
  var instance = new Class(); // FIXME: React might eventually improve to ease the work done here. see https://github.com/facebook/react/issues/4697#issuecomment-134335822
  instance.props = c.props;
  instance.context = context;
  var child = pickReactFirstChild(instance.render());
  var glComponentName = Class.displayName || Class.name || "";
  glComponentNameArray.push(glComponentName);
  return child;
};
//# sourceMappingURL=unfoldGLComponent.js.map