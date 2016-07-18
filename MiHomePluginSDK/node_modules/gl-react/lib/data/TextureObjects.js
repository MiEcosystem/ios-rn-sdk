"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function Content(id) {
  return { type: "content", id: id };
}

function NDArray(ndarray) {
  return { type: "ndarray", ndarray: ndarray };
}

function URI(obj) {
  return _extends({ type: "uri" }, obj);
}

function Framebuffer(id) {
  return { type: "fbo", id: id };
}

function withOpts(obj, opts) {
  return _extends({}, obj, { opts: opts });
}

module.exports = {
  Content: Content,
  NDArray: NDArray,
  URI: URI,
  Framebuffer: Framebuffer,
  withOpts: withOpts
};
//# sourceMappingURL=TextureObjects.js.map