var production = false;
var gulp = require('gulp');
var path = require('path');
//var webpack = require('gulp-webpack');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var GulpUtil = require('gulp-util');
var syncfolder = '';

gulp.task('build', function (callback) {
    console.log('Ecosystem is production', production);

    var plugins = [
        new ExtractTextPlugin("bundle.css", {allChunks: true})
    ];

    var webpackConfig = {
        entry: {
            client: './src/client/index.js',
            admin: './src/admin/index.js',
            server: './src/server/index.js',
        },
        output: {
            path: path.join(__dirname, "build"),
            filename: "[name]/bundle.js"
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel?presets[]=react&presets[]=es2015',
                    exclude: /node_modules/
                },
                {
                    test: /\.styl$/,
                    loader: ExtractTextPlugin.extract("stylus", "css-loader!stylus-loader"),
                    exclude: /node_modules/
                },
                {
                    test: /\.css/,
                    loader: ExtractTextPlugin.extract("css-loader"),
                    exclude: /node_modules/
                }
            ]
        },
        plugins: plugins
    };

    if (!production) {
        webpackConfig.devtool = 'inline-source-map';
    } else {
        plugins.push(new webpackOrig.optimize.UglifyJsPlugin({minimize: true}));
    }

    webpack(webpackConfig, function(err, stats) {
        if(err) throw new GulpUtil.PluginError("webpack:build", err);
        GulpUtil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });

});

gulp.task('prod', function () {
    production = true;
});
gulp.task('p', ['prod'], function () {});

gulp.task('watch', ['build'], function () {
    gulp.watch(
        [
            './src/**/*.js'
        ], ['build']);
});

gulp.task('default', ['build']);