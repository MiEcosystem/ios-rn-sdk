"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// fill the result of build() with more information that will make resolve() more efficient

function fill(dataTree) {
  function fillRec(node) {
    // we compute all the descendants vdom under the current node
    var descendantsVDOM = [node.vdom],
        descendantsVDOMData = [node.data];
    var newChildren = node.data.children.map(function (node) {
      var res = fillRec(node);
      if (descendantsVDOM.indexOf(res.vdom) === -1) {
        descendantsVDOM.push(res.vdom);
        descendantsVDOMData.push(res.data);
      }
      res.descendantsVDOM.forEach(function (vdom, i) {
        if (descendantsVDOM.indexOf(vdom) === -1) {
          descendantsVDOM.push(vdom);
          descendantsVDOMData.push(res.descendantsVDOMData[i]);
        }
      });
      return res;
    });
    return _extends({}, node, {
      data: _extends({}, node.data, { children: newChildren }),
      descendantsVDOM: descendantsVDOM,
      descendantsVDOMData: descendantsVDOMData
    });
  }
  return fillRec({ data: dataTree }).data;
}

module.exports = fill;
//# sourceMappingURL=fill.js.map