Find `require()` calls and report the dependencies they refer to.

This is like, and adapted from, [detective](https://www.npmjs.com/package/detective), but conducts its investigation with extreme prejudice (scope awareness). (Note: the scope awareness makes this significantly slower than detective.) That is, when this hits a scope that defines a `require` binding (e.g. as a `var` or a function parameter) it considers `require()` calls in that scope to no longer be the `require()` it's looking for and eliminates them from the output. Example:

Input:

```js
require("x");

(function (require) {
  require("y");
})();
```

Output (detective): `["x", "y"]`

Output (mcbain): `["x"]`

Why would scope awareness matter or be desirable? See [ substack/node-browserify#1151](substack/node-browserify/pull/1151) for an example. If you create a standalone bundle with browserify, then `require()` it into a subsequent browserify bundle without taking special measures to eliminate or ignore `require()` calls in the standalone bundle, detective will report modules that are already in the first bundle as dependencies that browserify (module-deps) will try to resolve and choke on. mcbain detects that the `require()` calls are nested in scopes that have defined `require` and eliminates them. Indeed, browserify has already resolved and packaged the dependencies they refer to and defined its own `require` to retrieve them.

Aside from that difference, this should mostly be able to function as a drop-in replacement for detective (albeit slower) in the sense that it has the same export profile and mostly the same API as detective. See its [`README`](https://github.com/substack/node-detective/blob/v4.3.1/readme.markdown) for documentation. This does not use acorn and does not support `opts.parse`. This passes detective's tests with the exception of those involving `opts.parse`.
