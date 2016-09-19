var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

webpackConfig.devtool = 'eval'; // For development only - increases output size
webpackConfig.plugins[0] =
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('development')
        }
    });

module.exports = webpackConfig;
