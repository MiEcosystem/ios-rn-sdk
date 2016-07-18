"use strict";

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _position = require("./position");

var _position2 = _interopRequireDefault(_position);

var _trimEnd = require("lodash/trimEnd");

var _trimEnd2 = _interopRequireDefault(_trimEnd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SPACES_RE = /^[ \t]+$/;

/**
 * The Buffer class exists to manage the queue of tokens being pushed onto the output string
 * in such a way that the final string buffer is treated as write-only until the final .get()
 * call. This allows V8 to optimize the output efficiently by not requiring it to store the
 * string in contiguous memory.
 */

var Buffer = function () {
  function Buffer(map) {
    (0, _classCallCheck3.default)(this, Buffer);
    this._map = null;
    this._buf = "";
    this._last = "";
    this._queue = [];
    this._position = new _position2.default();
    this._sourcePosition = {
      line: null,
      column: null,
      filename: null
    };

    this._map = map;
  }

  /**
   * Get the final string output from the buffer, along with the sourcemap if one exists.
   */

  Buffer.prototype.get = function get() {
    this._flush();

    return {
      code: (0, _trimEnd2.default)(this._buf),
      map: this._map ? this._map.get() : null
    };
  };

  /**
   * Add a string to the buffer that cannot be reverted.
   */

  Buffer.prototype.append = function append(str) {
    this._flush();
    this._append(str, this._sourcePosition.line, this._sourcePosition.column, this._sourcePosition.filename);
  };

  /**
   * Add a string to the buffer than can be reverted.
   */

  Buffer.prototype.queue = function queue(str) {
    this._queue.unshift([str, this._sourcePosition.line, this._sourcePosition.column, this._sourcePosition.filename]);
  };

  Buffer.prototype._flush = function _flush() {
    var item = void 0;
    while (item = this._queue.pop()) {
      this._append.apply(this, item);
    }
  };

  Buffer.prototype._append = function _append(str, line, column, filename) {
    // If there the line is ending, adding a new mapping marker is redundant
    if (this._map && str[0] !== "\n") this._map.mark(this._position, line, column, filename);

    this._buf += str;
    this._last = str[str.length - 1];
    this._position.push(str);
  };

  Buffer.prototype.removeTrailingSpaces = function removeTrailingSpaces() {
    while (this._queue.length > 0 && SPACES_RE.test(this._queue[0][0])) {
      this._queue.shift();
    }
  };

  Buffer.prototype.removeTrailingNewline = function removeTrailingNewline() {
    if (this._queue.length > 0 && this._queue[0][0] === "\n") this._queue.shift();
  };

  Buffer.prototype.removeLastSemicolon = function removeLastSemicolon() {
    if (this._queue.length > 0 && this._queue[0][0] === ";") this._queue.shift();
  };

  Buffer.prototype.endsWith = function endsWith(str) {
    var end = this._last + this._queue.reduce(function (acc, item) {
      return item[0] + acc;
    }, "");
    if (str.length <= end.length) {
      return end.slice(-str.length) === str;
    }

    // We assume that everything being matched is at most a single token plus some whitespace,
    // which everything currently is, but otherwise we'd have to expand _last or check _buf.
    return false;
  };

  Buffer.prototype.getLast = function getLast() {
    if (this._queue.length > 0) {
      var last = this._queue[0][0];
      return last[last.length - 1];
    }

    return this._last;
  };

  Buffer.prototype.hasContent = function hasContent() {
    return this._queue.length > 0 || !!this._last;
  };

  /**
   * Sets a given position as the current source location so generated code after this call
   * will be given this position in the sourcemap.
   */

  Buffer.prototype.source = function source(prop, loc) {
    if (prop && !loc) return;

    var pos = loc ? loc[prop] : null;

    this._sourcePosition.line = pos ? pos.line : null;
    this._sourcePosition.column = pos ? pos.column : null;
    this._sourcePosition.filename = loc && loc.filename || null;
  };

  /**
   * Call a callback with a specific source location and restore on completion.
   */

  Buffer.prototype.withSource = function withSource(prop, loc, cb) {
    if (!this._map) return cb();

    // Use the call stack to manage a stack of "source location" data.
    var originalLine = this._sourcePosition.line;
    var originalColumn = this._sourcePosition.column;
    var originalFilename = this._sourcePosition.filename;

    this.source(prop, loc);

    cb();

    this._sourcePosition.line = originalLine;
    this._sourcePosition.column = originalColumn;
    this._sourcePosition.filename = originalFilename;
  };

  Buffer.prototype.getCurrentColumn = function getCurrentColumn() {
    var extra = this._queue.reduce(function (acc, item) {
      return item[0] + acc;
    }, "");
    var lastIndex = extra.lastIndexOf("\n");

    return lastIndex === -1 ? this._position.column + extra.length : extra.length - 1 - lastIndex;
  };

  Buffer.prototype.getCurrentLine = function getCurrentLine() {
    var extra = this._queue.reduce(function (acc, item) {
      return item[0] + acc;
    }, "");

    var count = 0;
    for (var i = 0; i < extra.length; i++) {
      if (extra[i] === "\n") count++;
    }

    return this._position.line + count;
  };

  return Buffer;
}();

exports.default = Buffer;
module.exports = exports["default"];