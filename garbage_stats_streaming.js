
'use strict';

// this could be optimized for speed by flattening the structures
// alternatively by not using javascript



//  Rules:
//
//  * For all columns, count rows, nulls, and not-nulls.
//  ! For numeric columns, also count min, max, avg
//  ! For text columns compute count(shortest value), count(longest value), avg len, ties broken alpha

module.exports = class {

  init_stats(headers) {
    var stats = [];
    headers.map( (header,i) => stats[i] = this.newstat(header[1]) );
    console.log(JSON.stringify(stats));
    return stats;
  }

  update(stats, data, pos, rtype) {
    var s = stats[pos];
    s[data === null? 'nulls' : 'notnulls'] += 1;
    switch (rtype) {
      case 'number': console.log(typeof data + ', ' + rtype); s.avg_r += data; ++s.avg_c;
    }
    console.log(stats);
  }

  newstat(kind) {
    switch (kind) {

      case 'text': return {
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
