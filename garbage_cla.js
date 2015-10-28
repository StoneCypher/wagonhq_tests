
var CLA = {};
process.argv.forEach( function(value, index, _array) {
  if (index > 1) { // filter out argv[0],[1]

    var ssidx;

    if ((ssidx = value.indexOf('=')) != -1) {
      CLA[value.substring(0, ssidx - 1)] = value.substring(ssidx+1);
    } else {
      CLA[value] = true;
    }

    // cheat - if it's just an integer, override n with it
    // means multiple integers will override to the last
    if (value.match(/^\d+$/)) { CLA.n = parseInt(value, 10); }

  }
});

module.exports = CLA;
