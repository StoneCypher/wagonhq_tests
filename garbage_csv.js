
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

  p_row       (r,h) { return r.split(',').map( (cell,i) => (cell === '')? null : this.by_type(cell, i, h[i][1]) ); }
  p_hdr_cell  (hc)  { return hc.substring(0, hc.length-1).split(' ('); }
  p_header    (hdr) { return hdr.substring(1, hdr.length-1).split('","').map(this.p_hdr_cell); }

  reset_stats() {
    this.stats = this.stat.init_stats(this.headers);
  }

  num_or_throw(inp) {
    var pf = parseFloat(inp);
    if (!isNaN(pf) && isFinite(inp)) { return pf; } else { throw 'requires numeric'; }
  }

  by_type(data, pos, rtype) {

    switch (rtype) {

      case 'text'   :
        this.stat.update(this.stats, data, pos, rtype);
        return data;

      case 'number' :
        var d = this.num_or_throw(data);
        this.stat.update(this.stats, d, pos, rtype);
        return d;

    }
  }

  p_csv(csv) {

    this.rows    = csv.split('\n');
    this.headers = this.p_header(this.rows.shift());

    this.reset_stats();

    var row_h    = row => this.p_row(row, this.headers);
    this.data    = this.rows.map(row_h);

    return {headers: this.headers, data: this.data};

  }

};





// node doesn't do import/export yet :/

module.exports = csv_parser;
