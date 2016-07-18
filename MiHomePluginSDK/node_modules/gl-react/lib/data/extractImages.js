"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function extractImages(uniforms) {
  var images = [];
  for (var u in uniforms) {
    var value = uniforms[u];
    if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && value.type === "uri" && value.uri && typeof value.uri === "string") {
      images.push(value);
    }
  }
  return images;
}

module.exports = extractImages;
//# sourceMappingURL=extractImages.js.map