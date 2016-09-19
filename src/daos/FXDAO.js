var AjaxDAO = require('./AjaxDAO');
var Config = require('../Config');
var Immutable = require('immutable');

var FXDAO = {
    fetchRates()
    {
        return AjaxDAO.get(`${Config.api.fx}/rates`).then(makeImmutable);
    },
    exchange(crcCodeFrom, crcCodeTo, amount)
    {
        return AjaxDAO.post(`${Config.api.fx}/exchange`, {
            'from': crcCodeFrom,
            'to':crcCodeTo,
            'amt': amount
        });
    }
};

function makeImmutable(response)
{
    return Immutable.fromJS(response);
}

function makeKeyedImmutable (key, data) {
    if (!Array.isArray(data)) data = [data];
    var keys = pluck(data, key);
    return Immutable.fromJS(object(keys, data));
}

module.exports = FXDAO;
