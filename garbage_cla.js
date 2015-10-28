
var CLA = {};
process.argv.forEach( function(value, index, _array) {
  if (index > 1) { CLA[value] = true; } } // filter out argv[0],[1]
);

module.exports = CLA;
