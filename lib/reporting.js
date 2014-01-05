
var sprintf = require('sprintf-js').sprintf;

var printTableHeader = module.exports.printTableHeader = function(cell0, cell1) {
    _printRow(cell0, cell1);
    printTableDivider();
    _printRow();
};

var printTableDivider = module.exports.printTableDivider = function() {
    console.log('---------------------------|-----------------------------------------------------------------------');
};

var printTableRow = module.exports.printTableRow = function(cell0, cell1) {
    _printRow(cell0, cell1);
};

var printTableFooter = module.exports.printTableFooter = function() {
    _printRow();
    printTableDivider();
};

var printSummary = module.exports.printSummary = function(numTotal, numSuccess, numError, numTimedOut) {
    console.log('Summary:'.bold);
    console.log();
    console.log(sprintf('%9s: %s/%s', 'Success', numSuccess.toString().green, numTotal));

    if (numError) {
        console.log(sprintf('%9s: %s/%s', 'Error', numError.toString().red, numTotal));
    }

    if (numTimedOut) {
        console.log(sprintf('%9s: %s/%s', 'Timed Out', numTimedOut.toString().yellow, numTotal));
    }
};

var _printRow = function(cell0, cell1) {
    cell0 = cell0 || '';
    cell1 = cell1 || '';
    console.log(sprintf(' %-25s | %s', cell0, cell1));
};
