var path = require('path');
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.join(__dirname),
    devtool: 'cheap-module-source-map',
    entry: {
        main: './src/Main.jsx'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'public/js')
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015', 'stage-1'],
                    plugins: ['transform-decorators-legacy']
                }
            },
            { include: /\.json$/, loaders: ['json-loader'] }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new CopyWebpackPlugin([
            { from: 'assets/images', to: path.join(__dirname,'public/images') },
            { from: 'assets/stylesheets/ext', to: path.join(__dirname,'public/css/ext') }
        ])
    ],
    resolve: {
        extensions: ['', '.jsx', '.js', '.json']
    }
};
