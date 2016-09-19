var express = require('express');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var compression = require('compression');

var React = require('react');
var ReactDOMServer = require('react-dom/server');

// Allow server side React components to be written in jsx
require('babel-register')({
    ignore: false,
    presets: ['es2015', 'react'],
    extensions: ['.jsx']
});
var inProduction = process.env.NODE_ENV === 'production';
var Layout = require('./components/Layout'); // Get our layout for the initial page
var mConfig = require('../config/config.js');
var fxAPI = require('./api/fx.js');
var app = express();

app.set('views', path.resolve(__dirname, '../server'));
app.use(compression());

/**
 * Serve SCSS files dynamically
 */
app.use(sassMiddleware({
    src: path.resolve(__dirname, '../assets/stylesheets'),
    dest: path.resolve(__dirname, '../public/css'),
    prefix: '/css',
    debug: true
}));

app.use(express.static(path.resolve(app.mountpath, __dirname, '../public')));
app.use('/api/fx', fxAPI(mConfig)); // Set up our FX API here


// Render our base layout
app.get('/', function (req, res) {
    var markup = ReactDOMServer.renderToString(React.createElement(Layout, {settings: mConfig.client}));

    // React can't render the doctype so we need to prepend markup manually
    res.send('<!DOCTYPE html>' + markup);
});

var server = app.listen(inProduction ? mConfig.server.portProd : mConfig.server.portDev, function()
{
    var host = server.address().address;
    var port = server.address().port;

    console.log('HTTP Server: Listening at http://%s:%s', host, port);
});

console.info('HTTP Server: starting...');


