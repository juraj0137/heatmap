import mysql from 'mysql';

// host: 'http://heatmaphub.com:9100/',
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'heatmap'
});

let bulk = [];
let bulksize = 100;
let size = 0;

function feedVisitDataBulk(visitData, bulksize, cb) {
    bulk.push(visitData);
    size++;

    if (size >= bulksize) {
        bulk = bulk.map(function (item) {
            return mysql.escape(item.url) + ',' + mysql.escape(item.heatmap_data) + ',' + mysql.escape(item.visit_time.getTime());
        }).join('),(');
        var q = connection.query('INSERT INTO visit_data (url,heatmap_data, visit_time) VALUES (' + bulk + ')', function (err, result) {
            if (err)
                feedVisitDataBulk(visitData, bulksize, cb);

            cb();
        });
        size = 0;
        bulk = [];
    } else {
        cb();
    }
}

function feedVisitData(visitData, cb) {

    connection.query('INSERT INTO visit_data SET ?', visitData, function (err, result) {
        if (err)
            feedVisitData(visitData, cb);

        cb();
    });
}

function findExact(string, cb) {
    var starttime = new Date().getTime();
    connection.query('SELECT SQL_NO_CACHE  * FROM `visit_data` WHERE `url` = ? LIMIT 1000', [string], function (error, results, fields) {
        if (error)
            cb(undefined, error);

        cb({
            hits: {hits: results},
            took: new Date().getTime() - starttime
        }, undefined);
    });

}

function findStartWith(string, cb) {

    var starttime = new Date().getTime();
    var q = connection.query('SELECT * FROM `visit_data` WHERE `url` LIKE ? LIMIT 1000', [string + '%'], function (error, results) {
        if (error)
            cb(undefined, error);

        cb({
            hits: {hits: results},
            took: new Date().getTime() - starttime
        }, undefined);
    });
    // console.log(q.sql);

}

export {
    feedVisitData,
    feedVisitDataBulk,
    findExact,
    findStartWith
}