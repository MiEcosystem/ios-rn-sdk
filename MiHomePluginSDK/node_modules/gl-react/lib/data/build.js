"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _runtime = require("../runtime");

var _runtime2 = _interopRequireDefault(_runtime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require("react");
var invariant = require("invariant");
var Uniform = require("../Uniform");
var Shaders = require("../Shaders");
var TextureObjects = require("./TextureObjects");
var duckTypeUniformValue = require("./duckTypeUniformValue");
var findGLNodeInGLComponentChildren = require("./findGLNodeInGLComponentChildren");
var invariantStrictPositive = require("./invariantStrictPositive");


//// build: converts the gl-react VDOM DSL into an internal data tree.

module.exports = function build(glNode, context, parentPreload, via, surfaceId, decorateOnShaderCompile) {
  var props = glNode.props;
  var shader = Shaders._resolve(props.shader, surfaceId, decorateOnShaderCompile(props.onShaderCompile));
  var glNodeUniforms = props.uniforms;

  var _context$props = _extends({}, context, props);

  var width = _context$props.width;
  var height = _context$props.height;
  var pixelRatio = _context$props.pixelRatio;

  var newContext = {
    width: width,
    height: height,
    pixelRatio: pixelRatio
  };
  var glNodeChildren = props.children;
  var preload = "preload" in props ? props.preload : parentPreload;

  invariant(Shaders.exists(shader), "Shader #%s does not exists", shader);

  var shaderName = Shaders.get(shader).name;
  invariantStrictPositive(pixelRatio, "GL Component (" + shaderName + "). pixelRatio prop");

  var uniforms = _extends({}, glNodeUniforms);
  var children = [];
  var contents = [];

  React.Children.forEach(glNodeChildren, function (child) {
    invariant(child.type === Uniform, "(Shader '%s') GL.Node can only contains children of type GL.Uniform. Got '%s'", shaderName, child.type && child.type.displayName || child);
    var _child$props = child.props;
    var name = _child$props.name;
    var children = _child$props.children;

    var opts = _objectWithoutProperties(_child$props, ["name", "children"]);

    invariant(typeof name === "string" && name, "(Shader '%s') GL.Uniform must define an name String", shaderName);
    invariant(!glNodeUniforms || !(name in glNodeUniforms), "(Shader '%s') The uniform '%s' set by GL.Uniform must not be in {uniforms} props", shaderName);
    invariant(!(name in uniforms), "(Shader '%s') The uniform '%s' set by GL.Uniform must not be defined in another GL.Uniform", shaderName);
    uniforms[name] = !children || children.value ? children : { value: children, opts: opts }; // eslint-disable-line no-undef
  });

  Object.keys(uniforms).forEach(function (name) {
    var value = uniforms[name],
        opts = void 0;
    if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && !value.prototype && "value" in value) {
      // if value has a value field, we tread this field as the value, but keep opts in memory if provided
      if (_typeof(value.opts) === "object") {
        opts = value.opts;
      }
      value = value.value;
    }

    value = _runtime2.default.decorateUniformValue(value);

    try {
      switch (duckTypeUniformValue(value)) {

        case "string":
          // uri specified as a string
          uniforms[name] = TextureObjects.withOpts(TextureObjects.URI({ uri: value }), opts);
          break;

        case "{uri}":
          // uri specified in an object, we keep all other fields for RN "local" image use-case
          uniforms[name] = TextureObjects.withOpts(TextureObjects.URI(value), opts);
          break;

        case "ndarray":
          uniforms[name] = TextureObjects.withOpts(TextureObjects.NDArray(value), opts);
          break;

        case "vdom[]":
        case "vdom":
          {
            var res = findGLNodeInGLComponentChildren(value, newContext);
            if (res) {
              var childGLNode = res.childGLNode;
              var _via = res.via;
              var _context = res.context;
              // We have found a GL.Node children, we integrate it in the tree and recursively do the same

              children.push({
                vdom: value,
                uniform: name,
                data: build(childGLNode, _context, preload, _via, surfaceId, decorateOnShaderCompile)
              });
            } else {
              // in other cases VDOM, we will use child as a content
              contents.push({
                vdom: value,
                uniform: name,
                opts: opts
              });
            }
            break;
          }

        default:
          // Remaining cases will just set the value without further transformation
          uniforms[name] = value;
      }
    } catch (e) {
      delete uniforms[name];
      var message = "Shader '" + shaderName + "': uniform '" + name + "' " + e.message;
      if (process.env.NODE_ENV !== "production") console.error(message, value); // eslint-disable-line no-console
      throw new Error(message);
    }
  });

  return {
    shader: shader,
    uniforms: uniforms,
    width: width,
    height: height,
    pixelRatio: pixelRatio,
    children: children,
    contents: contents,
    preload: preload,
    via: via
  };
};
//# sourceMappingURL=build.js.map