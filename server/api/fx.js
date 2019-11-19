var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var https = require('https');
var libxml = require('libxmljs');
var _ = require('lodash');
var memcache = require('memory-cache');
var Q = require('q');

function fxAPI(config)
{
    var app = express();
    app.use(cookieParser());

    app.use(bodyParser.json());     // Support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ // Support URL-encoded bodies
        extended: true
    }));

    console.log('Setting up FX API...');

    /*=============================================================
        Utility methods
    =============================================================*/
    /**
     * Retrieves a file and returns its contents as a promise
     * @param sURL - of a file to download
     * @return {*|promise}
     */
    function loadFile(sURL)
    {
        var qDeff = Q.defer();

        https.get(sURL, function(res)
        {
            var body = '';
            res.on('data', function(d)
            {
                body += d;
            });

            res.on('end', function()
            {
                qDeff.resolve(body);
            });
        }).on('error', function(e)
        {
            console.error(e);
        });

        return qDeff.promise;
    }

    /**
     * Takes XML string to parse and return map of currency rates
     * @param sXML
     * @returns {{}}
     */
    function parseXMLRates(sXML)
    {
        var mResRates = {};
        var oXMLDoc = libxml.parseXmlString(sXML);
        var nss = oXMLDoc.root().namespaces();
        var mNS = {};
        _.map(nss, function(ns)
        {
            mNS['xmlns' + (ns.prefix() ? ns.prefix() : '')] = ns.href();
        });

        var aCubeElements = oXMLDoc.find('//xmlns:Cube[@currency][@rate]', mNS);
        _.map(aCubeElements, function(el)
        {
            mResRates[el.attr('currency').value()] = el.attr('rate').value();
        });

        return mResRates;
    }

    /**
     * Async method to download rates XML, parse and return as a map
     * Returns rates map in a promise
     * @return {*|Promise.<TResult>}
     */
    function loadParseRates()
    {
        return loadFile(config.ratesSourceURL).then(parseXMLRates);
    }

    /**
     * Returns cached rates or retrieves latest XML rates if cache expired
     */
    function getRates()
    {
        var qDeff = Q.defer();

        // First, check if we have already cached rates that have not expired yet
        var mRatesCached = memcache.get('rates');
        if(mRatesCached)
        {
            console.log('getRates - found cached rates');
            qDeff.resolve(mRatesCached);
            return qDeff.promise;
        }

        console.log('getRates - downloading latest rates from external source');
        loadParseRates().then(function(mRates)
        {
            mRates['EUR'] = mRates['EUR'] || "1.00";

            memcache.put('rates', mRates, config.ratesCacheTime); // Cache the rates

            qDeff.resolve(mRates);
        }).fail(function(err)
        {
            qDeff.reject(err);
        });

        return qDeff.promise;
    }


    /*=============================================================
        API endpoints
     =============================================================*/
    /**
     * @api {get} /api/fx/rates Retrieves available currency rates
     * @apiName rates
     * @apiGroup FX
     *
     * @apiSuccess {Object} rates Map of available currencies with rates
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "rates": {
     *          USD: "1.1193",
     *          JPY: "115.83"
     *       }
     *     }
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "<error desc>"
     *     }
     */
    app.get('/rates', function(req, res)
    {
        getRates().then(function(mRates)
        {
            res.json({'rates': mRates});
        }).fail(function(err)
        {
            res.status(500);
            res.json({'error': 'Could not retrieve rates ('+ err + ')'});
        });
    });


    /**
     * Example: exchange/?from=<currA>&to=<currB>&amt=<amount>
     */
    /**
     * @api {POST} /api/fx/exchange Exchanges currencies based on server-side rates
     * @apiName exchange
     * @apiGroup FX
     *
     * @apiSuccess {Object} rates Result map
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "params": {
     *          from: "USD",
     *          to: "GBP",
     *          amt: 123
     *       },
     *       "rate": "0.8520",
     *       "amount": "104.80"
     *     }
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "<error desc>"
     *     }
     */
    app.post('/exchange', function(req, res)
    {
        var mParams = {
            from: req.body.from,
            to:   req.body.to,
            amt:  req.body.amt
        };

        // Validate params
        if(!mParams.from || !mParams.to || mParams.amt === undefined)
        {
            res.status(500);
            return res.json({error: 'Please provide all parameters'});
        }

        getRates().then(function(mRates)
        {
            // Find currencies we need
            if(!mRates[mParams.from] || !mRates[mParams.to])
            {
                return res.status(500).json({
                    params: mParams,
                    error:'Rates for requested currencies not available'
                });
            }

            var excRate = (1 / +mRates[mParams.from] * +mRates[mParams.to]);
            var resultTotal = excRate * +mParams.amt;
            resultTotal = resultTotal.toFixed(2); // Round up


            // Adding artificial delay to demonstrate the loader etc..
            setTimeout(function(){
                res.json({
                    params: mParams,
                    rate: (excRate).toFixed(4),
                    amount: resultTotal
                });
            }, 1500);
        });
    });


    return app;
}

module.exports = fxAPI;
