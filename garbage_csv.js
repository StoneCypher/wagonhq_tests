
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

'use strict';

class csv_parser {

  constructor(stat) { this.stat = stat; }

  num_or_throw(inp) { var pf = parseFloat(inp); if (!isNaN(pf) && isFinite(inp)) { return pf; } else { throw 'requires numeric'; } }

  p_row       (r,h) { return r.split(',').map( (cell,i) => (cell === '')? null : this.by_type(cell, i, h[i][1]) ); }
  p_hdr_cell  (hc)  { return hc.substring(0, hc.length-1).split(' ('); }
  p_header    (hdr) { return hdr.substring(1, hdr.length-1).split('","').map(this.p_hdr_cell); }

  newstat(kind) {
    switch (kind) {
      case 'text'   : return { nulls: 0, notnulls: 0 };
      case 'number' : return { nulls: 0, notnulls: 0, avg_r: 0, avg_c: 0 };
    }
  }

  init_stats(headers) {
    this.stats = [];
    headers.map( (header,i) => this.stats[i] = this.newstat(header[1]) );
    console.log(JSON.stringify(this.stats));
  }

  num_or_throw(inp) {
    var pf = parseFloat(inp);
    if (!isNaN(pf) && isFinite(inp)) { return pf; } else { throw 'requires numeric'; }
  }

  by_type(data, pos, rtype) {
    switch (rtype) {
      case 'text'   : return data;
      case 'number' : return this.num_or_throw(data);
    }
  }

  p_csv(csv) {

    var rows    = csv.split('\n'),
        headers = this.p_header(rows.shift()),
        _res    = this.init_stats(headers),
        row_h   = row => this.p_row(row, headers),
        data    = rows.map(row_h);

    return {headers: headers, data: data};

  }

};





// node doesn't do import/export yet :/

module.exports = csv_parser;
