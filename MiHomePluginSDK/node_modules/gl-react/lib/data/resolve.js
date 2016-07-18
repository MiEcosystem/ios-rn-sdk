"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var invariant = require("invariant");

var findContentsUniq = require("./findContentsUniq");
var findChildrenDuplicates = require("./findChildrenDuplicates");
var TextureObjects = require("./TextureObjects");
var extractImages = require("./extractImages");
var uniqImages = require("./uniqImages");

///// resolve: takes the output of fill(build(*)) to generate the final data tree
// The algorithm simplifies the data tree to use shared framebuffers if some VDOM is duplicated in the tree (e.g: content / GL.Node)

function resolve(dataTree) {
  var imagesToPreload = [];

  // contents are view/canvas/image/video to be rasterized "globally"
  var contentsMeta = findContentsUniq(dataTree);
  var contentsVDOM = contentsMeta.map(function (_ref) {
    var vdom = _ref.vdom;
    return vdom;
  });

  // Recursively "resolve" the data to assign fboId and factorize duplicate uniforms to shared uniforms.
  function resolveRec(data, fboId, parentContext, parentFbos) {
    var dataUniforms = data.uniforms;
    var dataChildren = data.children;
    var dataContents = data.contents;
    var preload = data.preload;

    var dataRest = _objectWithoutProperties(data, ["uniforms", "children", "contents", "preload"]);

    var uniforms = _extends({}, dataUniforms);
    var parentContextVDOM = parentContext.map(function (_ref2) {
      var vdom = _ref2.vdom;
      return vdom;
    });

    // A function to generate a free FBO id for this node
    var genFboId = function (fboIdCounter) {
      return function () {
        fboIdCounter++;
        while (fboIdCounter === fboId || // fbo should not take the current one
        parentFbos.indexOf(fboIdCounter) !== -1) {
          // ensure fbo is not already taken in parents
          fboIdCounter++;
        }return fboIdCounter;
      };
    }(-1);

    // shared contains all nodes that are contains in more than one direct children.
    var shared = findChildrenDuplicates(data, parentContextVDOM);

    // We assign fboIds to shared
    var childrenContext = shared.map(function (_ref3) {
      var vdom = _ref3.vdom;

      var fboId = genFboId();
      return { vdom: vdom, fboId: fboId };
    });

    // We accumulate into context the childrenContext and the parentContext
    var context = parentContext.concat(childrenContext);
    var contextVDOM = context.map(function (_ref4) {
      var vdom = _ref4.vdom;
      return vdom;
    });
    var contextFbos = context.map(function (_ref5) {
      var fboId = _ref5.fboId;
      return fboId;
    });

    // contextChildren and children are field to fill for this node
    // We traverse the dataChildren to resolve where each child should go:
    // either we create a new child, a we create context child or we use an existing parent context
    var contextChildren = [];
    var children = [];

    var toRecord = dataChildren.concat(shared).map(function (child) {
      var uniform = child.uniform;
      var vdom = child.vdom;
      var data = child.data;

      var i = contextVDOM.indexOf(vdom);
      var fboId = void 0,
          addToCollection = void 0;
      if (i === -1) {
        fboId = genFboId();
        addToCollection = children;
      } else {
        fboId = context[i].fboId;
        if (i >= parentContext.length) {
          // is a new context children
          addToCollection = contextChildren;
        }
      }
      if (uniform) uniforms[uniform] = TextureObjects.Framebuffer(fboId);
      return { data: data, fboId: fboId, addToCollection: addToCollection };
    });

    var childrenFbos = toRecord.map(function (_ref6) {
      var fboId = _ref6.fboId;
      return fboId;
    });
    var allFbos = parentFbos.concat(contextFbos).concat(childrenFbos);

    var recorded = [];
    toRecord.forEach(function (_ref7) {
      var data = _ref7.data;
      var fboId = _ref7.fboId;
      var addToCollection = _ref7.addToCollection;

      if (recorded.indexOf(fboId) === -1) {
        recorded.push(fboId);
        if (addToCollection) addToCollection.unshift(resolveRec(data, fboId, context, allFbos));
      }
    });

    dataContents.forEach(function (_ref8) {
      var uniform = _ref8.uniform;
      var vdom = _ref8.vdom;
      var opts = _ref8.opts;

      var id = contentsVDOM.indexOf(vdom);
      invariant(id !== -1, "contents was discovered by findContentsMeta");
      uniforms[uniform] = TextureObjects.withOpts(TextureObjects.Content(id), opts);
    });

    // Check images to preload
    if (preload) {
      imagesToPreload = imagesToPreload.concat(extractImages(dataUniforms));
    }

    return _extends({}, dataRest, { // eslint-disable-line no-undef
      uniforms: uniforms,
      contextChildren: contextChildren,
      children: children,
      fboId: fboId
    });
  }

  return {
    data: resolveRec(dataTree, -1, [], []),
    contentsVDOM: contentsVDOM,
    imagesToPreload: uniqImages(imagesToPreload)
  };
}

module.exports = resolve;
//# sourceMappingURL=resolve.js.map