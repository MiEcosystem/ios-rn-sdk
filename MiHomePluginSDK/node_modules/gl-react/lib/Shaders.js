"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var invariant = require("invariant");
var defer = require("promise-defer");

var INLINE_NAME = "<inline>";

var _uid = 1;
var names = {}; // keep names
var shaders = {}; // keep shader objects
var shadersCompileResponses = {}; // keep promise of compile responses
var shadersCompileResults = {}; // keep only the successful result
var shadersReferenceCounters = {}; // reference count the shaders created with Shaders.create()/used inline so we don't delete them if one of 2 dups is still used

var surfaceInlines = {};
var previousSurfaceInlines = {};

var implDefer = defer();
var implementation = implDefer.promise;

var add = function add(shader) {
  var existingId = findShaderId(shaders, shader);
  var id = existingId || _uid++;
  var promise = void 0;
  if (!existingId) {
    names[id] = shader.name;
    shaders[id] = shader;
    shadersReferenceCounters[id] = 0;
    shadersCompileResponses[id] = promise = implementation.then(function (impl) {
      return impl.add(id, shader);
    }).then(function (result) {
      return shadersCompileResults[id] = result;
    });
  } else {
    promise = shadersCompileResponses[id];
  }
  return { id: id, promise: promise };
};

var remove = function remove(id) {
  delete shaders[id];
  delete names[id];
  delete shadersReferenceCounters[id];
  delete shadersCompileResponses[id];
  implementation.then(function (impl) {
    return impl.remove(id);
  });
};

var getShadersToRemove = function getShadersToRemove() {
  return Object.keys(shadersReferenceCounters).filter(function (id) {
    return shadersReferenceCounters[id] <= 0;
  }).map(function (id) {
    return parseInt(id, 10);
  });
};

var scheduled = void 0;
var gcNow = function gcNow() {
  clearTimeout(scheduled);
  getShadersToRemove().forEach(remove);
};
var scheduleGC = function scheduleGC() {
  // debounce the shader deletion to let a last chance to a future dup shader to appear
  // the idea is also to postpone this operation when the app is not so busy
  var noDebounce = getShadersToRemove().length > 20;
  if (!noDebounce) clearTimeout(scheduled);
  scheduled = setTimeout(gcNow, 500);
};

var sameShader = function sameShader(a, b) {
  return a.frag === b.frag;
};

var findShaderId = function findShaderId(shaders, shader) {
  for (var id in shaders) {
    if (sameShader(shaders[id], shader)) {
      return parseInt(id, 10);
    }
  }
  return null;
};

var logError = function logError(shader) {
  return function (error) {
    return console.error( //eslint-disable-line no-console
    "Shader '" + shader.name + "' failed to compile:\n" + error);
  };
};

var Shaders = {
  _onSurfaceWillMount: function _onSurfaceWillMount(surfaceId) {
    surfaceInlines[surfaceId] = [];
  },
  _onSurfaceWillUnmount: function _onSurfaceWillUnmount(surfaceId) {
    surfaceInlines[surfaceId].forEach(function (id) {
      return shadersReferenceCounters[id]--;
    });
    delete surfaceInlines[surfaceId];
    delete previousSurfaceInlines[surfaceId];
    scheduleGC();
  },
  _beforeSurfaceBuild: function _beforeSurfaceBuild(surfaceId) {
    previousSurfaceInlines[surfaceId] = surfaceInlines[surfaceId];
    surfaceInlines[surfaceId] = [];
  },


  // Resolve the shader field of GL.Node.
  // it can be an id (created with Shaders.create) or an inline object.
  _resolve: function _resolve(idOrObject, surfaceId, compileHandler) {
    if (typeof idOrObject === "number") return idOrObject;

    var _add = add(_extends({ name: INLINE_NAME }, idOrObject));

    var id = _add.id;
    var promise = _add.promise;

    if (compileHandler) {
      promise.then(function (result) {
        return compileHandler(null, result);
      }, function (error) {
        return compileHandler(error);
      });
    } else {
      promise.catch(logError(Shaders.get(id)));
    }
    var inlines = surfaceInlines[surfaceId];
    inlines.push(id);
    return id;
  },
  _afterSurfaceBuild: function _afterSurfaceBuild(surfaceId) {
    previousSurfaceInlines[surfaceId].forEach(function (id) {
      return shadersReferenceCounters[id]--;
    });
    surfaceInlines[surfaceId].forEach(function (id) {
      return shadersReferenceCounters[id]++;
    });
    delete previousSurfaceInlines[surfaceId];
    scheduleGC();
  },


  //~~~ Exposed methods ~~~ //

  // Create shaders statically
  create: function create(obj, onAllCompile) {
    invariant((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object", "config must be an object");
    var result = {};
    var compileErrors = {},
        compileResults = {};
    Promise.all(Object.keys(obj).map(function (key) {
      var shader = obj[key];
      invariant((typeof shader === "undefined" ? "undefined" : _typeof(shader)) === "object" && typeof shader.frag === "string", "invalid shader given to Shaders.create(). A valid shader is a { frag: String }");

      var _add2 = add(_extends({ name: key }, shader));

      var id = _add2.id;
      var promise = _add2.promise;

      result[key] = id;
      shadersReferenceCounters[id]++;
      return promise.then(function (result) {
        return compileResults[key] = result;
      }, function (error) {
        return compileErrors[key] = error;
      });
    })).then(function () {
      if (onAllCompile) {
        onAllCompile(Object.keys(compileErrors).length ? compileErrors : null, compileResults);
      } else {
        Object.keys(compileErrors).forEach(function (key) {
          return logError(Shaders.get(result[key]))(compileErrors[key]);
        });
      }
    });
    return result;
  },


  // Get the shader object by id.
  get: function get(id) {
    return Object.freeze(shaders[id]);
  },


  // Synchronously retrieve the successful compilation response.
  // returns or ShaderResult object or null if there were a failure or not ready
  getCompilationResult: function getCompilationResult(id) {
    return shadersCompileResults[id] || null;
  },


  // Get the promise of the compilation state. Allows you to wait for compilation
  // and also map on errors.
  // Returns null only if you never have created this shader.
  getCompilationPromise: function getCompilationPromise(id) {
    return shadersCompileResponses[id] || null;
  },


  // List all shader ids that exists at the moment.
  list: function list() {
    return Object.keys(shaders);
  },


  // Check if a shader exists
  exists: function exists(id) {
    return id in shaders;
  },


  gcNow: gcNow,

  setImplementation: function setImplementation(impl) {
    invariant(implDefer, "Shaders.setImplementation can be called only once");
    implDefer.resolve(impl);
    implDefer = null;
  },

  implementation: implementation
};

module.exports = Object.freeze(Shaders);
//# sourceMappingURL=Shaders.js.map