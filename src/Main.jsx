var React = require('react');
var reactDOM = require('react-dom');
var Config = require('./Config');

var FXStore = require('./stores/FXStore');
var FXActions = require('./actions/FXActions');

if (typeof Promise === 'undefined') {
    require('babel-polyfill');
}

var Reflux = require('reflux');
var RefluxPromise = require('reflux-promise');
Reflux.use(RefluxPromise(window.Promise));

Config.initialize(window.revolutAPP);
window.$ = require('jquery');
window._ = require('lodash');
window.React = require('react');


// Set up automatic rates refresh from server
setInterval(FXActions.getRates, Config.ratesPollFreq);

import {Loader} from './components/Loader';
import {FXForm} from './components/FXForm';
import {FXError} from './components/FXError';
import {FXResult} from './components/FXResult';

var Main = React.createClass({
    getInitialState()
    {
        return FXStore.getState();
    },
    componentDidMount()
    {
        FXStore.listen(this.onStoreChange);
        FXActions.getRates();
    },
    onStoreChange()
    {
        this.setState(FXStore.getState());
    },
    onUserInput(event)
    {
        console.warn('onUserInput:', event.target.value);
    },
    render()
    {
        return (
            <div className="container">
                <header className="row">
                    <div className="logo">
                        <img className="logo__img" src="images/logo.png" />
                    </div>
                    <div className="slogan">
                        <h2>Simply <i>Revolut</i>ionary</h2>
                    </div>
                </header>

                {this.state.ratesRetrieveErr ?
                    <FXError />
                    :
                    this.state.ratesPending ? <Loader message="Loading currency rates..." /> :
                        this.state.exchangeResult ? <FXResult result={this.state.exchangeResult} /> : <FXForm />
                }



                <footer>
                    <p className="b-copyright">Copyright &copy; 2016 Revolut Limited, registered in England and Wales (Company No. 08804411). Patent Pending.</p>
                </footer>
            </div>
        );
    }
});

reactDOM.render(<Main/>, document.querySelector('main'));
