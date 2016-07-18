"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Shaders = require("./Shaders");
var NAME = "(gl-react-post)";
module.exports = Shaders.create(_defineProperty({}, NAME, {
  frag: "\nprecision highp float;\nvarying vec2 uv;\nuniform sampler2D t;\nvoid main(){\n  gl_FragColor=texture2D(t,uv);\n}"
}))[NAME];
//# sourceMappingURL=postShader.js.map