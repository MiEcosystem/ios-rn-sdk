"use strict";

// recursively find shared VDOM across direct children.
// if a VDOM is used in 2 different children, it means we can share its computation in contextChildren
function findChildrenDuplicates(data, toIgnore) {
  var descendantsVDOM = [];
  var descendantsVDOMData = [];
  data.children.map(function (child) {
    descendantsVDOM = descendantsVDOM.concat(child.descendantsVDOM);
    descendantsVDOMData = descendantsVDOMData.concat(child.descendantsVDOMData);
  });
  return descendantsVDOM.map(function (vdom, allIndex) {
    if (toIgnore.indexOf(vdom) !== -1) return;
    var occ = 0;
    for (var i = 0; i < data.children.length; i++) {
      if (data.children[i].descendantsVDOM.indexOf(vdom) !== -1) {
        occ++;
        if (occ > 1) return {
          data: descendantsVDOMData[allIndex],
          vdom: vdom
        };
      }
    }
  }).filter(function (obj) {
    return obj;
  });
}

module.exports = findChildrenDuplicates;
//# sourceMappingURL=findChildrenDuplicates.js.map