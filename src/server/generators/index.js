require('babel-register');

var elastic = require('./elasticGenerator');
var generator = require('./visitDataGenerator');

var run = function (cb) {

    var i = 0;
    var max = 5000;
    var start = new Date().getTime();

    var loop = function (i) {
        var data = {
            "url": "www.aktuality.sk/",
            "heatmap_data": JSON.stringify(generator.generateVisitData()),
            "visit_time": new Date()
        };
        elastic.feedVisitData(data);
        i++;
        console.log("Progress " + (i / max) * 100 + "%");
        if (i < max) {
            setTimeout(function(){
                loop(i);
            }, 3);
        } else {
            var end = new Date().getTime();
            var totalTime = (end - start);
            console.log('inserted ' + max + ' documents, it took ' + totalTime + ' ms');
            cb();
        }
    };

    loop(i);


};

run();

module.exports = {
    run
};

