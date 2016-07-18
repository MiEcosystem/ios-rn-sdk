"use strict";

var invariant = require("invariant");

function invariantStrictPositive(value, name) {
  invariant(typeof value === "number" && value > 0 && !isNaN(value), "%s must be a strictly positive number. Got: '%s'", name, value);
}

module.exports = invariantStrictPositive;
//# sourceMappingURL=invariantStrictPositive.js.map