
var fs = require('fs');

// because this needs to be portably testable
var idx   = Math.floor(Math.random() * 5),
    which = './g' + idx.toString() + '.csv';

// console.log adds a newline :/
process.stdout.write(fs.readFileSync(which).toString());
