require('babel-register');

var winston = require("winston");
var express = require('express');
var path = require('path');

var production = true;
if (process.argv.indexOf('dev') > 0) {
    production = false;
}
console.log('Enviroment is ' + (production ? 'production' : 'developement'));

/**
 * Setup logger
 */
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: 'logger.log'})
    ]
});
logger.transports.console.level = 'debug';

/**
 * Network config for servers
 */
const LOCALHOST = '127.0.0.1';
const EXPRESS_PORT = 8080;

var app = express();

/**
 * Hot reload modul pre developing
 */
if (production == false) {

    var webpack = require('webpack');
    var config = require('./../../webpack.config');
    var compiler = webpack(config(production));

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config(production).output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));

}


/**
 * Static files
 */
const oneDay = 86400000;
app.use('/static/admin', express.static(path.join(__dirname, '../../build/admin'), {maxAge: oneDay}));
app.use('/static/css', express.static(path.join(__dirname, '../../build/css'), {maxAge: oneDay}));
app.use('/static', express.static(path.join(__dirname, '../../build/client'), {maxAge: oneDay}));

/**
 * API
 */
app.use('/api', require('./api/index.js'));

/**
 * Pre vsetky ostatne volania zobrazime index.html, kde sa nachadza React App s routrom
 */
app.get('*', (req, res)=> {
    res.sendFile(__dirname + '/views/index.html');
});

/**
 * Nastartujeme server
 */
var server = app.listen(EXPRESS_PORT, function (err) {

    if (err) {
        console.log(err);
        return;
    }

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
