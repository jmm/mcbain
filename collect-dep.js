/*
Like https://github.com/substack/node-detective, and adapted from it,
but scope aware (though slower).
*/

var
  assign = require("object-assign"),
  babel = require("babel-core"),
  plugin = require("babel-plugin-collect-dep"),
  word_regexes = {};

/**
 * Get / cache regex for `word`.
 * @param string word
 * @return RegExp
 */
function word_regex (word) {
  return word_regexes[word] = word_regexes[word] ||
    RegExp("\\b" + word + "\\b");
}

module.exports = exports = collect_dep;

/**
 * Find deps.
 * @param string src
 * @param object opts?
 * @return array Dep strings.
 */
function collect_dep (src, opts) {
  return find(src, opts).strings;
}
// collect_dep

exports.find = find;

/**
 * Find deps.
 * @param string src
 * @param object opts?
 * @return object Object with strings, expressions, nodes? arrays.
 */
function find (src, opts) {
  opts = assign({}, opts);

  if (typeof src !== "string") src = String(src);

  var deps = plugin.default_deps({nodes: opts.nodes});

  var word = opts.word === undefined ? plugin.default_word : opts.word;

  if (! word_regex(word).test(src)) return deps;

  /**
   * Callback for found dep. Add to the given collection.
   * @param string collection strings|expressions|nodes
   * @param string val
   */
  opts.dep = function (collection, val) {
    deps[collection].push(val);
  };

  babel.transform(src, {
    plugins: [
      [plugin, opts]
    ],
    code: false,
    ast: false,
  });

  return deps;
}
// find
