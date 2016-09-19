var config = {
    env:            'dev',
    ratesSourceURL: 'http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
    ratesCacheTime: 30 * 1000 // How long to cache downloaded XML rates server-side
};

// HTTP/API server
config.server = {
    portProd: 80,
    portDev: 3002
};

// Client (front-end) app settings
config.client = {
    api: {
        fx: '/api/fx'
    },
    currencies: { // Enabled currencies
        'GBP': {enabled: true},
        'EUR': {enabled: true},
        'USD': {enabled: true}
    },
    ratesPollFreq: 30 * 1000, // How often to poll server for updated fx rates (ms)
    userData: {
        amounts: {
            'USD': 100.00,
            'GBP': 0,
            'EUR': 13.23
        }
    }
};

module.exports = config;