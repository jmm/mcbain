var
  assign = require("object-assign"),
  babel = require("babel-core"),
  Plugin = require("babel-plugin-collect-dep"),
  word_regexes = {};

function word_regex (word) {
  return word_regexes[word] = word_regexes[word] ||
    RegExp("\\b" + word + "\\b");
}

module.exports = collect_dep;

function collect_dep (src, opts) {
  opts = assign({}, opts);

  if (typeof src !== "string") src = String(src);

  var deps = opts.deps || Plugin.default_deps({nodes: opts.nodes});

  var word = opts.word === undefined ? Plugin.default_word : opts.word;

  if (! word_regex(word).test(src)) return deps;

  opts.deps = deps;
  var plugin = Plugin.make(opts);

  babel.transform(src, {
    plugins: [
      plugin
    ],
    code: false,
    ast: false,
    whitelist: "",
    modules: "ignore",
  });

  return deps;
}
// collect_dep
