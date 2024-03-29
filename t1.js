
/////////
//
//  WagonHQ Coding Challenge 1
//  https://www.wagonhq.com/challenge
//
//  Given a system call returning N rows of CSV with one header row and dataset
//  determined types, gather type-defined statistics incrementally.  Header row
//  notation contains type determination.  Types appear to be either text or
//  number, though this is not explicitly defined.
//
//    Example Given
//    -------------
//
//    "sessionId (text)","page (text)","latency (number)","timeOnPage (number)"
//    b9130c05,welcome,7,31.032
//    b89c60d2,welcome,9,31.891
//    38bf03ee,query,79,489.585
//    b74f3339,explore,191,117.476
//    37d5727a,,10,
//    37661fc5,welcome,68,39.518
//    38a9bf72,,15,
//    b91c80f6,index,4,59.638
//
//  Rules:
//
//  * For all columns, count rows, nulls, and not-nulls.
//  * For numeric columns, also count min, max, avg
//  * For text columns compute count(shortest value), count(longest value), avg len, ties broken alpha
//
//  Bonus:
//
//





var cdata = '"sessionId (text)","page (text)","latency (number)","timeOnPage (number)"\nb9130c05,welcome,7,31.032\n37c1aa18,,44,\nb89c60d2,welcome,9,31.891';

var exec = require('child_process').execSync;

var stat = new (require('./garbage_stats_streaming.js'))(),
    CSV  = new (require('./garbage_csv.js'))(stat),
    CLA  = require('./garbage_cla.js'),

    cmd  = CLA.nogen? 'node ./fakegen.js' : ('./generator' + (CLA.n? (' ' + CLA.n.toString()) : '')),
    data = exec(cmd).toString().trim().replace(/\r?\n|\r/g, "\n");

console.log(CSV.p_csv(data, stat).stats);
