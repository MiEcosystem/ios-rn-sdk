"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var React = require("react");
var isAnimated = require("../isAnimated");

// infer the uniform value type and validate it (throw error if invalid)

function duckTypeUniformValue(obj) {
  var typ = typeof obj === "undefined" ? "undefined" : _typeof(obj);

  if (typ === "number") {
    if (isNaN(obj) || !isFinite(obj)) throw new Error("invalid number: '" + obj + "'");
    return typ;
  }

  if (typ === "boolean") {
    return typ;
  }

  if (typ === "string") {
    return typ;
  }

  if (typ === "undefined") {
    return null;
  }

  if (typ === "object") {

    if (!obj) {
      return null;
    }

    if (typeof obj.uri === "string") {
      return "{uri}";
    }

    if (obj.data && obj.shape && obj.stride) {
      return "ndarray";
    }

    if (obj instanceof Array) {
      var length = obj.length;
      if (!length) throw new Error("array is empty");
      var foundAnimated = false;
      var foundVDOM = false;
      var foundNumber = false;
      var foundBoolean = false;
      for (var i = 0; i < length; i++) {
        var val = obj[i];
        var t = typeof val === "undefined" ? "undefined" : _typeof(val);
        switch (t) {
          case "object":
            if (val && isAnimated(val)) foundAnimated = true;else if (val && React.isValidElement(val)) foundVDOM = true;else if (val instanceof Array) return duckTypeUniformValue(val);else throw new Error("at index " + i + ", Unrecognized object: '" + val + "'");
            break;

          case "number":
            if (isNaN(val) || !isFinite(val)) throw new Error("at index " + i + ", invalid number: '" + val + "'");
            foundNumber = true;
            break;

          case "boolean":
            foundBoolean = true;
            break;

          default:
            throw new Error("at index " + i + ", Unrecognized object: " + val);
        }
      }

      var foundNumberOrBooleanOrAnimated = foundNumber || foundBoolean || foundAnimated;
      if (foundNumberOrBooleanOrAnimated && foundVDOM) {
        throw new Error("Invalid array. Found both VDOM value and numbers/booleans/animated");
      }

      if (foundVDOM) {
        return "vdom[]";
      }
      if (foundAnimated) {
        return "animated[]";
      }
      if (foundNumber) {
        return "number[]";
      }
      if (foundBoolean) {
        return "boolean[]";
      }
    }

    if (isAnimated(obj)) {
      return "animated";
    }

    if (React.isValidElement(obj)) {
      return "vdom";
    }
  }

  throw new Error("Unrecognized object: " + obj);
}

module.exports = duckTypeUniformValue;
//# sourceMappingURL=duckTypeUniformValue.js.map