var cookie = require('cookie');

var defaultSettings = Object.freeze({
    dataType: 'json',
    contentType: 'application/json'
});

var csrfToken = cookie.parse(document.cookie)['XSRF-TOKEN'];

function settings (type, url, customSettings) {
    return _.extend({}, defaultSettings, { url: url, type: type }, customSettings);
}

function globalFailHandler(resp){}

function appendCrossSiteForgeryHeader (options) {
    options = options || {};
    options.headers = options.headers || {};
    options.headers['X-CSRF-Token'] = csrfToken;
    return options;
}

function ajax (type, url, options) {
    var _settings = settings(type, url, options);
    return $.ajax(_settings).fail(globalFailHandler);
}

var AjaxDAO = {
    get: function(url, options) {
        return ajax('get', url, options);
    },
    patch: function (url, payload, options) {
        options = appendCrossSiteForgeryHeader(options);
        options.data = payload;
        return ajax('patch', url, options);
    },
    post: function (url, payload, options) {
        options = appendCrossSiteForgeryHeader(options);
        options.data = JSON.stringify(payload);
        return ajax('post', url, options);
    },
    put: function (url, payload, options) {
        options = appendCrossSiteForgeryHeader(options);
        options.data = JSON.stringify(payload);
        return ajax('put', url, options);
    },
    destroy: function (url, options) {
        options = appendCrossSiteForgeryHeader(options);
        return ajax('delete', url, options);
    }
};
module.exports = AjaxDAO;
