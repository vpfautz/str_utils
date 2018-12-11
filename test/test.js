const assert = require('assert');
const { fmt } = require("..");


describe('Formatter', function () {
  describe("coloring and utf8", function () {
    it('utf8 should work', function () {
      let t = "¯\\_(ツ)_/¯";
      assert.equal("  " + t, fmt("%12s", t));
      assert.equal(t + "  ", fmt("%-12s", t));
    });
    it('color codes should work', function () {
      let t = "\x1b[31ma\x1b[39m";
      assert.equal("  " + t, fmt("%3s", t));
      assert.equal(t + "  ", fmt("%-3s", t));
    });
  });
  describe('no parameters', function () {
    it('"asdf" should be adsf', function () {
      assert.equal(fmt("asdf"), "asdf");
    });
    it('"a" should be a', function () {
      assert.equal(fmt("a"), "a");
    });
    it('"" should be empty string', function () {
      assert.equal(fmt(""), "");
    });
    it('unknown type', function () {
      assert.throws(() => fmt("%y"), /Invalid format/);
    });
    it('too many parameters should fail', function () {
      assert.throws(() => fmt("%d", 1, 2), /Too many params given!/);
      assert.throws(() => fmt("", 1), /Too many params given!/);
    });
    it('too less parameters should fail', function () {
      assert.throws(() => fmt("%d %d", 1), /Too less params given!/);
      assert.throws(() => fmt("%d"), /Too less params given!/);
    });
    it('escapes', function () {
      assert.equal(fmt("%%"), "%");
      assert.equal(fmt("a%%b"), "a%b");
      assert.equal(fmt("a%%%%b"), "a%%b");
      assert.equal(fmt("a%% %%b"), "a% %b");
    });
  });
  describe('string pattern', function () {
    it('one string', function () {
      assert.equal(fmt("%s", "a"), "a");
      assert.equal(fmt("%s", 1.5), "1.5");
      assert.equal(fmt("%s", 1), "1");
      assert.equal(fmt("%03s", 1), "  1");
      assert.equal(fmt("%3s", 1), "  1");
      assert.equal(fmt("%05s", 1.5), "  1.5");
      assert.equal(fmt("%5s", 1.5), "  1.5");
      assert.equal(fmt("%5s", "a"), "    a");
      assert.equal(fmt("%05s", "a"), "    a");
      assert.equal(fmt("%-5s", "a"), "a    ");
      assert.equal(fmt("%5s", "abc"), "  abc");
      assert.equal(fmt("%-5s", "abc"), "abc  ");
      assert.equal(fmt("%4s", "12345"), "12345");
    });
    it('two strings', function () {
      assert.equal(fmt("%s %s", "a", "b"), "a b");
    });
    it('false formatting', function () {
      assert.equal(fmt("%.3s", 1), "1");
      assert.equal(fmt("%.03s", 1), "1");
      assert.equal(fmt("%.3s", "a"), "a");
      assert.equal(fmt("%.03s", "a"), "a");
      assert.throws(() => fmt("%.-03s", "a"), /Invalid format/);
    });
  });
  describe('number pattern', function () {
    it('wrong param type', function () {
      assert.throws(() => fmt("%d", "adsf"), /number expected/);
    });
    it('one number', function () {
      assert.equal(fmt("%d", 1.5), "1");
      assert.equal(fmt("%d", 2), "2");
      assert.equal(fmt("%.2d", 1), "01");
      assert.equal(fmt("%.02d", 1), "01");
      assert.equal(fmt("%02d", 1), "01");
      assert.equal(fmt("%2d", 1), " 1");
      assert.equal(fmt("%-2d", 1), "1 ");
      assert.equal(fmt("%-5.2d", 1), "01   ");
      assert.equal(fmt("%5.2d", 1), "   01");
    });
    it('two numbers', function () {
      assert.equal(fmt("%d %d", 1, 2), "1 2");
    });
    it('false formatting', function () {
      assert.throws(() => fmt("%.-03d", 1), /Invalid format/);
      assert.throws(() => fmt("%.-3d", 1), /Invalid format/);
    });
  });
  describe('float pattern', function () {
    it('wrong param type', function () {
      assert.throws(() => fmt("%f", "adsf"), /number expected/);
    });
    it('one float', function () {
      assert.equal(fmt("%.1f", 1.23), "1.2");
      assert.equal(fmt("%.0f", 1.23), "1");
      assert.equal(fmt("%f", 1.5), "1.500000");
      assert.equal(fmt("%.2f", 1.5), "1.50");
      assert.equal(fmt("%06.2f", 1.5), "001.50");
      assert.equal(fmt("%6.2f", 1.5), "  1.50");
      assert.equal(fmt("%-6.2f", 1.5), "1.50  ");
    });
    it('two floats', function () {
      assert.equal(fmt("%f %f", 1.4, 2), "1.400000 2.000000");
    });
    it('false formatting', function () {
      assert.throws(() => fmt("%.-03f", 1), /Invalid format/);
      assert.throws(() => fmt("%.-3f", 1), /Invalid format/);
    });
  });
  describe('json', function () {
    it('array', function () {
      assert.equal(fmt("%j", [1, 2, 3]), "[1,2,3]");
    });
    it('obj', function () {
      assert.equal(
        fmt("%j", { n: "test", a: [1, 2, 3] }),
        '{"n":"test","a":[1,2,3]}');
    });
  });
  describe('percentage', function () {
    it('wrong param type', function () {
      assert.throws(() => fmt("%p", "adsf"), /number expected/);
    });
    it('test', function () {
      assert.equal(fmt("%p", 0.5), "50.0%");
      assert.equal(fmt("%p", 0.1235), "12.3%");
      assert.equal(fmt("%p", 1), "100.0%");
      assert.equal(fmt("%6p", 1), "100.0%");
      assert.equal(fmt("%7p", 1), " 100.0%");
      assert.equal(fmt("%07p", 1), "0100.0%");
      assert.equal(fmt("%.0p", 1), "100%");
    });
  });
});
