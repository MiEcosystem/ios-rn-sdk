"use strict";

exports.__esModule = true;

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _repeat = require("lodash/repeat");

var _repeat2 = _interopRequireDefault(_repeat);

var _buffer = require("./buffer");

var _buffer2 = _interopRequireDefault(_buffer);

var _node = require("./node");

var n = _interopRequireWildcard(_node);

var _babelTypes = require("babel-types");

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len: 0 */

var Printer = function () {
  function Printer(format, map) {
    (0, _classCallCheck3.default)(this, Printer);

    this._format = format || {};
    this._buf = new _buffer2.default(map);
    this.insideAux = false;
    this.printAuxAfterOnNextUserNode = false;
    this._printStack = [];
    this.printedCommentStarts = {};
    this.parenPushNewlineState = null;
    this._indent = 0;
  }

  /**
   * Get the current indent.
   */

  Printer.prototype._getIndent = function _getIndent() {
    if (this._format.compact || this._format.concise) {
      return "";
    } else {
      return (0, _repeat2.default)(this._format.indent.style, this._indent);
    }
  };

  /**
   * Increment indent size.
   */

  Printer.prototype.indent = function indent() {
    this._indent++;
  };

  /**
   * Decrement indent size.
   */

  Printer.prototype.dedent = function dedent() {
    this._indent--;
  };

  /**
   * Add a semicolon to the buffer.
   */

  Printer.prototype.semicolon = function semicolon() {
    this._append(";", true /* queue */);
  };

  /**
   * Add a right brace to the buffer.
   */

  Printer.prototype.rightBrace = function rightBrace() {
    if (!this.endsWith("\n")) this.newline();

    if (this._format.minified && !this._lastPrintedIsEmptyStatement) {
      this._buf.removeLastSemicolon();
    }
    this.token("}");
  };

  /**
   * Add a keyword to the buffer.
   */

  Printer.prototype.keyword = function keyword(name) {
    this.word(name);
    this.space();
  };

  /**
   * Add a space to the buffer unless it is compact.
   */

  Printer.prototype.space = function space() {
    var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    if (this._format.compact) return;

    if (this._buf.hasContent() && !this.endsWith(" ") && !this.endsWith("\n") || force) {
      this._space();
    }
  };

  /**
   * Writes a token that can't be safely parsed without taking whitespace into account.
   */

  Printer.prototype.word = function word(str) {
    if (this._endsWithWord) this._space();

    this._append(str);

    this._endsWithWord = true;
  };

  /**
   * Writes a simple token.
   */

  Printer.prototype.token = function token(str) {
    var last = this._buf.getLast();
    // space is mandatory to avoid outputting <!--
    // http://javascript.spec.whatwg.org/#comment-syntax
    if (str === "--" && last === "!" ||

    // Need spaces for operators of the same kind to avoid: `a+++b`
    str[0] === "+" && last === "+" || str[0] === "-" && last === "-") {
      this._space();
    }

    this._append(str);
  };

  /**
   * Add a newline (or many newlines), maintaining formatting.
   */

  Printer.prototype.newline = function newline(i) {
    if (this._format.retainLines || this._format.compact) return;

    if (this._format.concise) {
      this.space();
      return;
    }

    // never allow more than two lines
    if (this.endsWith("\n\n")) return;

    if (typeof i !== "number") i = 1;

    i = Math.min(2, i);
    if (this.endsWith("{\n") || this.endsWith(":\n")) i--;
    if (i <= 0) return;

    this._buf.removeTrailingSpaces();
    for (var j = 0; j < i; j++) {
      this._newline();
    }
  };

  Printer.prototype.endsWith = function endsWith(str) {
    return this._buf.endsWith(str);
  };

  Printer.prototype.removeTrailingNewline = function removeTrailingNewline() {
    this._buf.removeTrailingNewline();
  };

  Printer.prototype.source = function source(prop, loc) {
    this._catchUp(prop, loc);

    this._buf.source(prop, loc);
  };

  Printer.prototype.withSource = function withSource(prop, loc, cb) {
    this._catchUp(prop, loc);

    this._buf.withSource(prop, loc, cb);
  };

  Printer.prototype._space = function _space() {
    this._append(" ", true /* queue */);
  };

  Printer.prototype._newline = function _newline() {
    this._append("\n", true /* queue */);
  };

  Printer.prototype._append = function _append(str) {
    var queue = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    this._maybeAddParen(str);
    this._maybeIndent(str);

    if (queue) this._buf.queue(str);else this._buf.append(str);

    this._endsWithWord = false;
  };

  Printer.prototype._maybeIndent = function _maybeIndent(str) {
    // we've got a newline before us so prepend on the indentation
    if (!this._format.compact && this._indent && this.endsWith("\n") && str[0] !== "\n") {
      this._buf.queue(this._getIndent());
    }
  };

  Printer.prototype._maybeAddParen = function _maybeAddParen(str) {
    // see startTerminatorless() instance method
    var parenPushNewlineState = this.parenPushNewlineState;
    if (!parenPushNewlineState) return;
    this.parenPushNewlineState = null;

    var i = void 0;
    for (i = 0; i < str.length && str[i] === " "; i++) {
      continue;
    }if (i === str.length) return;

    var cha = str[i];
    if (cha === "\n" || cha === "/") {
      // we're going to break this terminator expression so we need to add a parentheses
      this.token("(");
      this.indent();
      parenPushNewlineState.printed = true;
    }
  };

  Printer.prototype._catchUp = function _catchUp(prop, loc) {
    if (!this._format.retainLines) return;

    // catch up to this nodes newline if we're behind
    var pos = loc ? loc[prop] : null;
    if (pos && pos.line !== null) {
      while (this._buf.getCurrentLine() < pos.line) {
        this._newline();
      }
    }
  };

  /**
   * Set some state that will be modified if a newline has been inserted before any
   * non-space characters.
   *
   * This is to prevent breaking semantics for terminatorless separator nodes. eg:
   *
   *    return foo;
   *
   * returns `foo`. But if we do:
   *
   *   return
   *   foo;
   *
   *  `undefined` will be returned and not `foo` due to the terminator.
   */

  Printer.prototype.startTerminatorless = function startTerminatorless() {
    return this.parenPushNewlineState = {
      printed: false
    };
  };

  /**
   * Print an ending parentheses if a starting one has been printed.
   */

  Printer.prototype.endTerminatorless = function endTerminatorless(state) {
    if (state.printed) {
      this.dedent();
      this.newline();
      this.token(")");
    }
  };

  Printer.prototype.print = function print(node, parent) {
    var _this = this;

    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    if (!node) return;

    this._lastPrintedIsEmptyStatement = false;

    if (parent && parent._compact) {
      node._compact = true;
    }

    var oldInAux = this.insideAux;
    this.insideAux = !node.loc;

    var oldConcise = this._format.concise;
    if (node._compact) {
      this._format.concise = true;
    }

    var printMethod = this[node.type];
    if (!printMethod) {
      throw new ReferenceError("unknown node of type " + (0, _stringify2.default)(node.type) + " with constructor " + (0, _stringify2.default)(node && node.constructor.name));
    }

    this._printStack.push(node);

    if (node.loc) this.printAuxAfterComment();
    this.printAuxBeforeComment(oldInAux);

    var needsParens = n.needsParens(node, parent, this._printStack);
    if (needsParens) this.token("(");

    this.printLeadingComments(node, parent);

    this._printNewline(true, node, parent, opts);

    if (opts.before) opts.before();

    var loc = t.isProgram(node) || t.isFile(node) ? null : node.loc;
    this.withSource("start", loc, function () {
      _this[node.type](node, parent);
    });

    // Check again if any of our children may have left an aux comment on the stack
    if (node.loc) this.printAuxAfterComment();

    this.printTrailingComments(node, parent);

    if (needsParens) this.token(")");

    // end
    this._printStack.pop();
    if (opts.after) opts.after();

    this._format.concise = oldConcise;
    this.insideAux = oldInAux;

    this._printNewline(false, node, parent, opts);
  };

  Printer.prototype.printAuxBeforeComment = function printAuxBeforeComment(wasInAux) {
    var comment = this._format.auxiliaryCommentBefore;
    if (!wasInAux && this.insideAux && !this.printAuxAfterOnNextUserNode) {
      this.printAuxAfterOnNextUserNode = true;
      if (comment) this.printComment({
        type: "CommentBlock",
        value: comment
      });
    }
  };

  Printer.prototype.printAuxAfterComment = function printAuxAfterComment() {
    if (this.printAuxAfterOnNextUserNode) {
      this.printAuxAfterOnNextUserNode = false;
      var comment = this._format.auxiliaryCommentAfter;
      if (comment) this.printComment({
        type: "CommentBlock",
        value: comment
      });
    }
  };

  Printer.prototype.getPossibleRaw = function getPossibleRaw(node) {
    if (this._format.minified) return;

    var extra = node.extra;
    if (extra && extra.raw != null && extra.rawValue != null && node.value === extra.rawValue) {
      return extra.raw;
    }
  };

  Printer.prototype.printJoin = function printJoin(nodes, parent) {
    var _this2 = this;

    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    if (!nodes || !nodes.length) return;

    var len = nodes.length;
    var node = void 0,
        i = void 0;

    if (opts.indent) this.indent();

    var printOpts = {
      statement: opts.statement,
      addNewlines: opts.addNewlines,
      after: function after() {
        if (opts.iterator) {
          opts.iterator(node, i);
        }

        if (opts.separator && parent.loc) {
          _this2.printAuxAfterComment();
        }

        if (opts.separator && i < len - 1) {
          opts.separator.call(_this2);
        }
      }
    };

    for (i = 0; i < nodes.length; i++) {
      node = nodes[i];
      this.print(node, parent, printOpts);
    }

    if (opts.indent) this.dedent();
  };

  Printer.prototype.printAndIndentOnComments = function printAndIndentOnComments(node, parent) {
    var indent = !!node.leadingComments;
    if (indent) this.indent();
    this.print(node, parent);
    if (indent) this.dedent();
  };

  Printer.prototype.printBlock = function printBlock(parent) {
    var node = parent.body;

    if (!t.isEmptyStatement(node)) {
      this.space();
    }

    this.print(node, parent);
  };

  Printer.prototype.generateComment = function generateComment(comment) {
    var val = comment.value;
    if (comment.type === "CommentLine") {
      val = "//" + val;
    } else {
      val = "/*" + val + "*/";
    }
    return val;
  };

  Printer.prototype.printTrailingComments = function printTrailingComments(node, parent) {
    this.printComments(this.getComments(false, node, parent));
  };

  Printer.prototype.printLeadingComments = function printLeadingComments(node, parent) {
    this.printComments(this.getComments(true, node, parent));
  };

  Printer.prototype.printInnerComments = function printInnerComments(node) {
    var indent = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    if (!node.innerComments) return;
    if (indent) this.indent();
    this.printComments(node.innerComments);
    if (indent) this.dedent();
  };

  Printer.prototype.printSequence = function printSequence(nodes, parent) {
    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    opts.statement = true;
    return this.printJoin(nodes, parent, opts);
  };

  Printer.prototype.printList = function printList(items, parent) {
    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    if (opts.separator == null) {
      opts.separator = commaSeparator;
    }

    return this.printJoin(items, parent, opts);
  };

  Printer.prototype._printNewline = function _printNewline(leading, node, parent, opts) {
    // Fast path since 'this.newline' does nothing when not tracking lines.
    if (this._format.retainLines || this._format.compact) return;

    if (!opts.statement && !n.isUserWhitespacable(node, parent)) {
      return;
    }

    // Fast path for concise since 'this.newline' just inserts a space when
    // concise formatting is in use.
    if (this._format.concise) {
      this.space();
      return;
    }

    var lines = 0;

    if (node.start != null && !node._ignoreUserWhitespace && this.tokens.length) {
      // user node
      if (leading) {
        lines = this.whitespace.getNewlinesBefore(node);
      } else {
        lines = this.whitespace.getNewlinesAfter(node);
      }
    } else {
      // generated node
      if (!leading) lines++; // always include at least a single line after
      if (opts.addNewlines) lines += opts.addNewlines(leading, node) || 0;

      var needs = n.needsWhitespaceAfter;
      if (leading) needs = n.needsWhitespaceBefore;
      if (needs(node, parent)) lines++;

      // generated nodes can't add starting file whitespace
      if (!this._buf.hasContent()) lines = 0;
    }

    this.newline(lines);
  };

  Printer.prototype.getComments = function getComments(leading, node) {
    // Note, we use a boolean flag here instead of passing in the attribute name as it is faster
    // because this is called extremely frequently.
    return node && (leading ? node.leadingComments : node.trailingComments) || [];
  };

  Printer.prototype.shouldPrintComment = function shouldPrintComment(comment) {
    if (this._format.shouldPrintComment) {
      return this._format.shouldPrintComment(comment.value);
    } else {
      if (!this._format.minified && (comment.value.indexOf("@license") >= 0 || comment.value.indexOf("@preserve") >= 0)) {
        return true;
      } else {
        return this._format.comments;
      }
    }
  };

  Printer.prototype.printComment = function printComment(comment) {
    var _this3 = this;

    if (!this.shouldPrintComment(comment)) return;

    if (comment.ignore) return;
    comment.ignore = true;

    if (comment.start != null) {
      if (this.printedCommentStarts[comment.start]) return;
      this.printedCommentStarts[comment.start] = true;
    }

    // Exclude comments from source mappings since they will only clutter things.
    this.withSource("start", comment.loc, function () {
      // whitespace before
      _this3.newline(_this3.whitespace.getNewlinesBefore(comment));

      if (!_this3.endsWith("[") && !_this3.endsWith("{")) _this3.space();

      var val = _this3.generateComment(comment);

      //
      if (comment.type === "CommentBlock" && _this3._format.indent.adjustMultilineComment) {
        var offset = comment.loc && comment.loc.start.column;
        if (offset) {
          var newlineRegex = new RegExp("\\n\\s{1," + offset + "}", "g");
          val = val.replace(newlineRegex, "\n");
        }

        var indentSize = Math.max(_this3._getIndent().length, _this3._buf.getCurrentColumn());
        val = val.replace(/\n(?!$)/g, "\n" + (0, _repeat2.default)(" ", indentSize));
      }

      // force a newline for line comments when retainLines is set in case the next printed node
      // doesn't catch up
      if ((_this3._format.compact || _this3._format.concise || _this3._format.retainLines) && comment.type === "CommentLine") {
        val += "\n";
      }

      //
      _this3.token(val);

      // whitespace after
      _this3.newline(_this3.whitespace.getNewlinesAfter(comment));
    });
  };

  Printer.prototype.printComments = function printComments(comments) {
    if (!comments || !comments.length) return;

    for (var _iterator = comments, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var comment = _ref;

      this.printComment(comment);
    }
  };

  return Printer;
}();

exports.default = Printer;


function commaSeparator() {
  this.token(",");
  this.space();
}

var _arr = [require("./generators/template-literals"), require("./generators/expressions"), require("./generators/statements"), require("./generators/classes"), require("./generators/methods"), require("./generators/modules"), require("./generators/types"), require("./generators/flow"), require("./generators/base"), require("./generators/jsx")];
for (var _i2 = 0; _i2 < _arr.length; _i2++) {
  var generator = _arr[_i2];
  (0, _assign2.default)(Printer.prototype, generator);
}
module.exports = exports["default"];