require('babel-register');

var elastic = require('./elasticGenerator');
var mysql = require('./mysqlGenerator');
var generator = require('./visitDataGenerator');
var meta = {};

var run = function (conf, cb) {

    var config = conf || {};

    config.max = config.max || 10000;
    config.db = config.db || 'mysql';
    config.sleep = config.sleep || 10;
    config.bulk = config.bulk || 1;

    meta.config = config;
    meta.startTime = new Date().getTime();
    meta.endTime = undefined;

    var i = 0;
    var max = config.max;
    var timer = null;

    var data = generator.generateVisitData();

    var loop = function (i) {

        if (Math.random() < 0.1) {
            data = generator.generateVisitData();
        }

        if (timer == null) {
            meta.iteration = i;
            timer = setInterval(function () {
                clearInterval(timer);
                timer = null;
            }, 50)
        }

        i++;

        if (i > max) {
            meta.endTime = end = new Date().getTime();
            meta.executionTime = meta.endTime - meta.startTime;
            meta.iteration = i;
            if (typeof cb == 'function') {
                cb(meta);
            }
            return;
        }

        if (config.db == 'elastic') {
            if (config.bulk > 1) {
                elastic.feedVisitDataBulk(data, config.bulk, function () {
                    loop(i);
                });
            } else {
                elastic.feedVisitData(data, function () {
                    loop(i);
                });
            }
        } else if (config.db == 'mysql') {
            if (config.bulk > 1) {
                mysql.feedVisitDataBulk(data, config.bulk, function () {
                    loop(i);
                });
            } else {
                mysql.feedVisitData(data, function () {
                    loop(i);
                });
            }
        }
    };

    loop(i);
};

setInterval(function () {
    console.log("progress: " + (meta.iteration / meta.config.max) * 100 + "%");
}, 5000);

var bulks = [50];
var numOfIteration = 1;
var totalTime = 0;
var resultString = '';

var bulking = function (i, config, cbmain) {
    config.bulk = bulks[i];
    console.log('------------------ bulksize ' + bulks[i]);

    var iteration = function (k, cb) {
        console.log('---------------------- iteration ' + k);
        run(config, function (meta) {
            totalTime += meta.executionTime;
            if (k + 1 < numOfIteration)
                iteration(k + 1, cb);
            else
                cb();
        });
    };
    iteration(0, function () {
        resultString += 'bulksize: ' + config.bulk + ', execution time: ' + Math.round((totalTime / 100) / numOfIteration) / 10 + 's\n';
        totalTime = 0;
        if (i + 1 < bulks.length) {
            bulking(i + 1, config, cbmain);
        } else {
            console.log(resultString);
            cbmain();
        }
    });
};
var conf = {
    max: 1000000,
    db: 'mysql'
};
var start = new Date().getTime();

console.log('--------------- ' + conf.db + ' - ' + conf.max);
bulking(0, conf, function () {
    var end = new Date().getTime();
    console.log('testing tooks' + Math.round((end - start) / 100) / 10 + 's');
    process.exit(0);
});


module.exports = {
    run,
    bulking
};

