"use strict";

module.exports = function (object, keys) {
  var o = {};
  keys.forEach(function (k) {
    if (object.hasOwnProperty(k)) o[k] = object[k];
  });
  return o;
};
//# sourceMappingURL=pluckObject.js.map