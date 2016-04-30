import elastic from 'elasticsearch';

// host: 'http://heatmaphub.com:9100/',
let connection = elastic.Client({
    host: 'localhost:9200',
    log: false
});

let bulk = [];
let bulksize = 500;
let size = 0;

function feedVisitDataBulk(visitData, bulksize, cb) {

    bulk.push({
        index: {
            _index: 'visit_data',
            _type: 'visit'
        }
    });
    bulk.push(visitData);
    size++;

    if (size >= bulksize) {
        connection.bulk({
            body: bulk
        }).then(function (result) {
            cb();
        });
        size = 0;
        bulk = [];
    } else {
        cb();
    }
}

function feedVisitData(visitData, cb) {
    connection.index({
        index: 'visit_data',
        type: 'visit',
        body: visitData
    }).then(function (result) {
        if (result.created == false) {
            feedVisitData(visitData, cb);
        }
        cb();
    });
}

function findExact(string, cb) {
    var starttime = new Date().getTime();
    connection.search({
        index: 'visit_data',
        type: 'visit',
        requestCache: false,
        body: {
            query: {
                bool: {
                    must: [{term: {url: string}}]
                }
            },
            size: 1000
        }
    }).then(function (resp) {
        resp.took = new Date().getTime() - starttime;
        cb(resp, undefined);
    }, function (err) {
        cb(undefined, err);
    });
}

function findStartWith(string, cb) {
    var starttime = new Date().getTime();
    connection.search({
        index: 'visit_data',
        type: 'visit',
        // requestCache: false,
        body: {
            "query": {
                "wildcard": {
                    "url": string + "*"
                }
            },
            size: 1000
        }
    }).then(function (resp) {
        resp.took = new Date().getTime() - starttime;
        cb(resp, undefined);
    }, function (err) {
        cb(undefined, err);
    });

}

export {
    feedVisitData,
    feedVisitDataBulk,
    findExact,
    findStartWith
}