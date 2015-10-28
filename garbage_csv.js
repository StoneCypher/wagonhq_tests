
// assumes the csv has been newline normalized and fits the example generator
// handles a subset of csv
//
// split rows on commas; replace empties with nulls
// remove trailing ) from header cells, split on space-(, return split
// remove framing "" from header row, split on ",", return header cell subsplit
// a csv is a header row then a series of rows
//
// p_csv is for bulk processing; mostly use p_row for streaming
// p_csv also implies two passes over the data: one to parse, one to act (ew)
//
// assume unknown col types are throw

var stats;

function newstat(kind) {
  switch (kind) {
    case 'text'   : return { nulls: 0, notnulls: 0 };
    case 'number' : return { nulls: 0, notnulls: 0, avg_r: 0, avg_c: 0 };
  }
}

function init_stats(headers) {
  stats = [];
  headers.map( (header,i) => stats[i] = newstat(header[1]) );
  console.log(JSON.stringify(stats));
}

function by_type(data, pos, rtype) {
  switch (rtype) {
    case 'text'   : return data;
    case 'number' : return num_or_throw(data);
  }
}

num_or_throw = (inp) => { var pf = parseFloat(inp); if (!isNaN(pf) && isFinite(inp)) { return pf; } else { throw 'requires numeric'; } }

p_row        = (r,h) => r.split(',').map( (cell,i) => (cell === '')? null : by_type(cell, i, h[i][1]) );
p_hdr_cell   = (hc)  => hc.substring(0, hc.length-1).split(' (')
p_header     = (hdr) => hdr.substring(1, hdr.length-1).split('","').map(p_hdr_cell);

function p_csv(csv) {

  var rows    = csv.split('\n'),
      headers = p_header(rows.shift()),
      _res    = init_stats(headers),
      row_h   = function(row) { return p_row(row, headers); },
      data    = rows.map(row_h);

  return {headers: headers, data: data};

}




// node doesn't do import/export yet :/

module.exports = {

  p_row      : p_row,
  p_header   : p_header,
  p_hdr_cell : p_hdr_cell,
  p_csv      : p_csv

};
