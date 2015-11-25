var test = require("tap").test;
var detective = require("detective");
var mcbain = require("../");
var fs = require("fs");

// A standalone bundle produced by browserify.
var src = fs.readFileSync(__dirname + "/fixtures/standalone-bundle.js");

// detective should find deps.
test("detective", function (t) {
  t.notEqual(detective(src).length, 0);
  t.end();
});

// mcbain should not find deps.
test("mcbain", function (t) {
  t.equal(mcbain(src).length, 0);
  t.end();
});
