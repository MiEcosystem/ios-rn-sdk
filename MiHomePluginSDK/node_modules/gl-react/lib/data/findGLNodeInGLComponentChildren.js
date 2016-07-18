"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var unfoldGLComponent = require("./unfoldGLComponent");
var pluckObject = require("./pluckObject");

module.exports = function findGLNodeInGLComponentChildren(children, context) {
  // going down the VDOM tree, while we can unfold GLComponent
  var via = [];
  var accContext = context;
  for (var c = children; c && typeof c.type === "function"; c = unfoldGLComponent(c, accContext, via)) {
    accContext = _extends({}, accContext, pluckObject(c.props, ["width", "height", "pixelRatio"]));
    if (c.type.isGLNode) return { childGLNode: c, via: via, context: accContext }; // found a GLNode
  }
};
//# sourceMappingURL=findGLNodeInGLComponentChildren.js.map