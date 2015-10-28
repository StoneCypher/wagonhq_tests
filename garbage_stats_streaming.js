
'use strict';

// this could be optimized for speed by flattening the structures
// alternatively by not using javascript



//  Rules:
//
//  * For all columns, count rows, nulls, and not-nulls.
//  * For numeric columns, also count min, max, avg
//  ! For text columns compute count(shortest value), count(longest value), avg len, ties broken alpha

module.exports = class {

  init_stats(headers) {
    var stats = [];
    headers.map( (header,i) => stats[i] = this.newstat(header[1]) );
    return stats;
  }

  isLonger(one, other) {
    if (one.length > other.length)    { return true; }
    if (one.length < other.length)    { return false; }
    return one > other;
  }

  update(stats, data, pos, rtype) {
    var s = stats[pos];
    s[(data === null)? 'nulls' : 'notnulls'] += 1;

    if (data === null) { return; }

    switch (rtype) {

      case 'number':
        s.avg_r += data;
        ++s.avg_c;
        s.min = (typeof s.min === 'undefined')? data : Math.min(data, s.min);
        s.max = (typeof s.max === 'undefined')? data : Math.max(data, s.min);
        break;

      case 'text':
        s.avg_l_r += data.length;
        ++s.avg_l_c;

        if      (typeof s.longest.val === 'undefined')  { s.longest.val = data;  s.longest.count = 1; }
        else if (data === s.longest.val)                { ++s.longest.count; }
        else if (this.isLonger(data, s.longest.val))    { s.longest.val = data;  s.longest.count = 1; }

        if      (typeof s.shortest.val === 'undefined') { s.shortest.val = data; s.shortest.count = 1; }
        else if (data === s.shortest.val)               { ++s.shortest.count; }
        else if (this.isLonger(s.shortest.val, data))   { s.shortest.val = data; s.shortest.count = 1; }

        break;

    }

  }

  finalize(stat_counters) {

    return stat_counters.map( (col,i) => {
      col.rows = col.nulls + col.notnulls;  // not sure why we're computing this; it's always the same number

      switch (col.kind) {

        case 'number':
          col.avg = (col.avg_c === 0)? 0 : (col.avg_r / col.avg_c);
          return col;

        case 'text':
          col.avg_l = (col.avg_l_c === 0)? 0 : (col.avg_l_r / col.avg_l_c);
          return col;

      }
    });
  }

  newstat(kind) {
    switch (kind) {

      case 'text': return {
        kind     : 'text',
        nulls    : 0,
        notnulls : 0,
        avg_l_r  : 0,
        avg_l_c  : 0,
        longest  : {
          val   : undefined,
          count : 0
        },
        shortest : {
          val   : undefined,
          count : 0
        }
      };

      case 'number' : return {
        kind     : 'number',
        nulls    : 0,
        notnulls : 0,
        avg_r    : 0,
        avg_c    : 0,
        min      : undefined,
        max      : undefined
      };

    }
  }

};
