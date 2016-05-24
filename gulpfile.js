var production = false;
var gulp = require('gulp');
var webpack = require('webpack');
var GulpUtil = require('gulp-util');
var config = require('./webpack.config.fnc');
var warnings = false;

gulp.task('build', function (callback) {
    
    console.log('Ecosystem is production', production);

    webpack(config(production), function(err, stats) {
        if(err) throw new GulpUtil.PluginError("webpack:build", err);
        GulpUtil.log("[webpack]", stats.toString({
            colors: true,
            modules: false,
            chunks: false,
            children: false,
            warnings: warnings
        }));
        callback();
    });

});

gulp.task('prod', function () {
    production = true;
});
gulp.task('p', ['prod'], function () {});
gulp.task('check', function () {
    warnings = true;
});

gulp.task('watch', ['build'], function () {
    gulp.watch(
        [
            './src/**/*.js'
        ], ['build']);
});

gulp.task('default', ['build']);