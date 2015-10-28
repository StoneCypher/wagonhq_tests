
'use strict';

module.exports = class {

  init_stats(headers) {
    var stats = [];
    headers.map( (header,i) => stats[i] = this.newstat(header[1]) );
    console.log(JSON.stringify(stats));
    return stats;
  }

  newstat(kind) {
    switch (kind) {
      case 'text'   : return { nulls: 0, notnulls: 0 };
      case 'number' : return { nulls: 0, notnulls: 0, avg_r: 0, avg_c: 0 };
    }
  }

};
