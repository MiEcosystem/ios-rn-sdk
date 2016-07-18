"use strict";

// recursively find all contents but without duplicates by comparing VDOM reference
function findContentsUniq(data) {
  var vdoms = [];
  var contents = [];
  function rec(data) {
    data.contents.forEach(function (content) {
      if (vdoms.indexOf(content.vdom) === -1) {
        vdoms.push(content.vdom);
        contents.push(content);
      }
    });
    data.children.forEach(function (child) {
      rec(child.data);
    });
  }
  rec(data);
  return contents;
}

module.exports = findContentsUniq;
//# sourceMappingURL=findContentsUniq.js.map