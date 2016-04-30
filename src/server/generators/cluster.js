var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }


    cluster.on('exit', function (worker, code, signal) {
        meta.workers = meta.workers.filter((item)=> {
            return item.pid != worker.process.pid;
        });
        cluster.fork();
    });


} else {

    var generator = require("./store.js");

    var conf = {
        max: 500000,
        db: 'elastic'
    };

    generator.bulking(0, conf, function () {
        process.exit(0);
    });
}
