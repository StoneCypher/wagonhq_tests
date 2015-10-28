
// split rows on commas; replace empties with nulls
// remove trailing ) from header cells, split on space-(, return split
// remove framing "" from header row, split on ",", return header cell subsplit
// a csv is a header row then a series of rows
//
// p_csv is for bulk processing; mostly use p_row for streaming
// p_csv also implies two passes over the data: one to parse, one to act (ew)

is_num     = (num) => !isNaN(parseFloat(num)) && isFinite(num);
num_if_num = (inp) => { var pf = parseFloat(inp); return (!isNaN(pf) && isFinite(inp))? pf : inp; }

p_row      = (row) => row.split(',').map(cell => (cell === '')? null : num_if_num(cell) );
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
