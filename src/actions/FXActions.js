var Reflux = require('reflux');
var RefluxPromise = require('reflux-promise');
var FXDAO = require('../daos/FXDAO');

Reflux.use(RefluxPromise(window.Promise));

var FXActions = Reflux.createActions({
    getRates:         {asyncResult: true},
    exchange:         {asyncResult: true},
    submit:           {sync: true},
    setCurrencyCodeA: {sync: true},
    setCurrencyCodeB: {sync: true},
    setCurrencyAmtA:  {sync: true},
    setCurrencyAmtB:  {sync: true},
    reset: {sync: true}
});

FXActions.getRates.listenAndPromise(FXDAO.fetchRates);
FXActions.exchange.listenAndPromise(FXDAO.exchange);

module.exports = FXActions;