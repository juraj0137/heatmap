var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

function config(production) {

    var isProd = (production != undefined && production == true);

    console.log('webpack is production: ', isProd);

    var plugins = [
        new ExtractTextPlugin("bundle.css", {allChunks: true})
    ];


    var loaders = {
        'css': '',
        'less': '!less-loader',
        'styl': '!stylus-loader'
    };


    function stylesLoaders() {
        return Object.keys(loaders).map(ext => {
            const prefix = 'css-loader';
            const extLoaders = prefix + loaders[ext];
            const loader = isProd
                ? ExtractTextPlugin.extract('style-loader', extLoaders)
                : `style-loader!${extLoaders}`;
            return {
                loader,
                test: new RegExp(`\\.(${ext})$`)
            };
        });
    }

    var webpackConfig = {
        output: {
            path: path.join(__dirname, "build"),
            filename: "[name]/bundle.js",
            publicPath: '/static/'
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel?presets[]=react&presets[]=es2015',
                    exclude: /node_modules/
                },
                // bootstrap
                {test: /\.svg/, loader: 'url-loader?limit=10000'},
                {test: /\.eot/, loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject'},
                {test: /\.woff2/, loader: 'url-loader?limit=100000&mimetype=application/font-woff2'},
                {test: /\.woff/, loader: 'url-loader?limit=100000&mimetype=application/font-woff'},
                {test: /\.ttf/, loader: 'url-loader?limit=100000&mimetype=application/font-ttf'},
                {test: /\.json$/, loader: "json"}
            ].concat(stylesLoaders())
        },
        node: {
            dns: 'mock',
            net: 'mock'
        },
        plugins: plugins
    };

    if (!isProd) {
        webpackConfig.devtool = 'inline-source-map';
        webpackConfig.entry = {
            admin: ['webpack-hot-middleware/client', './src/admin/index.js'],
            client: ['webpack-hot-middleware/client', './src/client/index.js']
        };
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NoErrorsPlugin());
    } else {
        webpackConfig.entry = {
            admin: ['./src/admin/index.js'],
            client: ['./src/client/index.js']
        };
        plugins.push(new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                compress: {
                    warnings: false
                }
            }
        ));
        plugins.push(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }))
    }

    return webpackConfig;

}
module.exports = config;
