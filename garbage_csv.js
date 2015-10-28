
// split rows on commas; replace empties with nulls
// remove trailing ) from header cells, split on space-(, return split
// remove framing "" from header row, split on ",", return header cell subsplit
// a csv is a header row then a series of rows

p_row      = (row) => row.split(',').map(cell => (cell === '')? null : cell );
p_hdr_cell = (hc)  => hc.substring(0, hc.length-1).split(' (')
p_header   = (hdr) => hdr.substring(1, hdr.length-1).split('","').map(p_hdr_cell);
p_csv      = (csv) => csv.split('\n').map( (row,idx) => idx? p_row(row) : p_header(row) );





// node doesn't do import/export yet :/

module.exports = {

  p_row      : p_row,
  p_header   : p_header,
  p_hdr_cell : p_hdr_cell,
  p_csv      : p_csv

};
