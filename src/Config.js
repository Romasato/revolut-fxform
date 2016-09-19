var _ = require('lodash');

var Config = {};

Config.initialize = function (appConfigObj) {
    if (Config.initialized) return;
    _.extend(Config, appConfigObj, { initialized: true });
};

module.exports = Config;
