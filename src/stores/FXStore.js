var Reflux = require('reflux');
var Immutable = require('immutable');
var Config = require('../Config');

var FXActions = require('../actions/FXActions.js');
var FXDAO = require('../daos/FXDAO.js');

// Store internal variables
var _ratesPending = true;
var _ratesRetrieveErr = false;
var _exchangePending = false;
var _rates = Immutable.Map();
var _crcCodeA = 'GBP'; // Default
var _crcAmtA = '0.00';
var _crcCodeB = 'EUR'; // Default
var _crcAmtB = '0.00';
var _exchangeResult = null;
var _exchangeResultShow = false;
var _cachedInputAmounts = Immutable.Map();

var FXStore = Reflux.createStore({
    listenables: [FXActions],

    getState()
    {
        return {
            rates:        _rates,
            currencies:   Immutable.fromJS(Config.currencies),
            currencyFrom: _crcCodeA,
            currencyFromAmt: _crcAmtA,
            currencyTo:   _crcCodeB,
            currencyToAmt: _crcAmtB,
            ratesPending: _ratesPending,
            userBalance:  Immutable.fromJS(Config.userData.amounts),
            ratesRetrieveErr: _ratesRetrieveErr,
            exchangePending: _exchangePending,
            exchangeResult: _exchangeResult
        }
    },

    onGetRates() // When we just started AJAX request
    {
        _ratesPending = true;
    },

    /**
     * Callback once rates from server are fetched
     * @param rates
     */
    onGetRatesCompleted(rates)
    {
        _rates = rates.get('rates');
        _ratesPending = false;
        this.trigger();
    },
    onGetRatesFailed(err)
    {
        console.warn('onGetRatesFailed:', err);
        _ratesPending = false;
        _ratesRetrieveErr = true;
        this.trigger();
    },

    onSetCurrencyCodeA(newCrcCode)
    {
        if(newCrcCode === _crcCodeA) { return; }

        _crcCodeA = newCrcCode;
        _crcAmtA = _cachedInputAmounts.get(_crcCodeA) || 0.00;
        _crcAmtB = this.convertCrc(_crcCodeA, _crcAmtA, _crcCodeB);
        this.trigger()
    },
    onSetCurrencyCodeB(newCrcCode)
    {
        if(newCrcCode === _crcCodeB) { return; }

        _crcCodeB = newCrcCode;
        _crcAmtB = this.convertCrc(_crcCodeA, _crcAmtA, _crcCodeB);
        this.trigger()
    },
    onSetCurrencyAmtA(newCrcAmt)
    {
        _crcAmtA = newCrcAmt;
        _cachedInputAmounts = _cachedInputAmounts.set(_crcCodeA, _crcAmtA);
        _crcAmtB = this.convertCrc(_crcCodeA, _crcAmtA, _crcCodeB);

        this.trigger()
    },
    onSetCurrencyAmtB(newCrcAmt)
    {
        _crcAmtB = newCrcAmt;
        // _cachedInputAmounts = _cachedInputAmounts.set(_crcCodeB, _crcAmtB); Do no cache crc B
        _crcAmtA = -1 * this.convertCrc(_crcCodeB, _crcAmtB, _crcCodeA);
        this.trigger()
    },


    /**
     * Converts currency A amount to currency B based on _rates
     * @param fromCode
     * @param fromAmt
     * @param toCode
     * @returns {string}
     */
    convertCrc(fromCode, fromAmt, toCode)
    {
        var crcRateFrom = _rates.get(fromCode);
        var crcRateTo = _rates.get(toCode);

        // Find currencies we need
        if(!crcRateFrom || !crcRateTo)
        {
            return;
        }

        var fTotal = (1 / +crcRateFrom * +crcRateTo) * +fromAmt;

        return fTotal.toFixed(2);
    },

    getCompareRate(crcCodeFrom, crcCodeTo)
    {
        var crcRateFrom = _rates.get(crcCodeFrom);
        var crcRateTo = _rates.get(crcCodeTo);
        return (1 / +crcRateFrom) * +crcRateTo
    },

    onSubmit()
    {
        FXActions.exchange(_crcCodeA, _crcCodeB, _crcAmtA);
    },

    onExchange() { _exchangePending = true; this.trigger(); },
    onExchangeCompleted(mResult)
    {
        _exchangePending = false;
        _exchangeResult = Immutable.fromJS(mResult);
        _exchangeResultShow = true;
        console.warn('Exchange AJAX result:', mResult);
        this.trigger();
    },
    onExchangeFailed(mResult)
    {
        _exchangePending = false;
        _exchangeResult = Immutable.fromJS(mResult);
        _exchangeResultShow = true;
        console.warn('Failed exchange AJAX result:', mResult);
        this.trigger();
    },

    onReset()
    {
        _ratesPending = false;
        _ratesRetrieveErr = false;

        _exchangePending = false;
        _exchangeResult = null;
        _exchangeResultShow = false;

        this.trigger();
    }
});

module.exports = FXStore;