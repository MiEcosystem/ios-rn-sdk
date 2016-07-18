PromiseDefer.js
===============
[![NPM version][npm-badge]](http://badge.fury.io/js/promise-defer)
[npm-badge]: https://badge.fury.io/js/promise-defer.png

**PromiseDefer.js** is a small `Promise.defer` "polyfill" to create
a [`Deferred`][deferred] object you can **later resolve or reject** and get
a `Promise` out of. It used to exist in browsers and JavaScript engines as
`Promise.defer`, but was later deprecated. It's still useful in some cases.

PromiseDefer.js uses the **native ES6 `Promise` by default**, but you can pass
it another **Promises/A+ compatible** constructor function.

[deferred]: https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
[promisesa+]: https://promisesaplus.com/


Installing
----------
```sh
npm install promise-defer
```

PromiseDefer.js follows [semantic versioning](http://semver.org/), so feel
free to depend on its major version with something like `>= 1.0.0 < 2`
(a.k.a `^1.0.0`).


Using
-----
```javascript
var defer = require("promise-defer")

var deferred = defer()
deferred.resolve(42)
deferred.promise // Will eventually be resolved with 42.

var rejection = defer()
rejection.reject(new Error("I'll have none of that, thank you."))
rejection.promise // Will eventually be rejected with the error.
```

PromiseDefer.js will use the global ES6 `Promise` constructor by default that's
starting to become available in browsers and JavaScript runtimes (e.g. the V8 in
Node.js v0.11). It doesn't therefore have any outside dependencies.

### Using another Promise implementation
If you'd like to use another promise implementation or are running in an
environment that doesn't have the native `Promise`, pass
a [Promises/A+][promisesa+] compatible constructor as the first argument:

```javascript
var Bluebird = require("bluebird")
var defer = require("promise-defer").bind(null, Bluebird)
defer().promise // => An instance of Bluebird.
```

### Deferred class
If you need to programmatically differentiate beteween regular objects and
`Deferred` instances, use the `instanceof` operator:

```javascript
var Deferred = require("promise-defer")
Deferred() instanceof Deferred // => true
```


License
-------
PromiseDefer.js is released under a *Lesser GNU Affero General Public License*,
which in summary means:

- You **can** use this program for **no cost**.
- You **can** use this program for **both personal and commercial reasons**.
- You **do not have to share your own program's code** which uses this program.
- You **have to share modifications** (e.g. bug-fixes) you've made to this
  program.

For more convoluted language, see the `LICENSE` file.


About
-----
**[Andri Möll][moll]** typed this and the code.  
[Monday Calendar][monday] supported the engineering work.

If you find PromiseDefer.js needs improving, please don't hesitate to type to me
now at [andri@dot.ee][email] or [create an issue online][issues].

[email]: mailto:andri@dot.ee
[issues]: https://github.com/moll/js-promise-defer/issues
[moll]: http://themoll.com
[monday]: https://mondayapp.com
