import {PropTypes, Component} from 'react';
import classnames from 'classnames';

var FXStore = require('../stores/FXStore');
var FXActions = require('../actions/FXActions');

import {CurrencyBlock} from './CurrencyBlock';
import {CurrencySelector} from './CurrencySelector';
import {Loader} from './Loader';

export class FXForm extends Component {

    constructor(props)
    {
        super(props);
        this.state = FXStore.getState();
    }

    componentDidMount = ()=>
    {
        this.unsubscribe = FXStore.listen(this.onStoreChange);
        FXActions.getRates();
    };

    componentWillUnmount = () => {
        this.unsubscribe(); // Unsubscribe
    };

    onStoreChange = ()=>
    {
        this.setState(FXStore.getState());
    };

    render()
    {
        if(this.state.exchangePending)
        {
            return (
                <div className="fxForm__pendingOverlay">
                    <Loader message="Exchanging..."/>
                </div>
            );
        }

        let {currencyFrom, currencyTo} = this.state;

        let disableSubmit = (+this.state.currencyFromAmt === 0 || currencyFrom === currencyTo);

        return (
            <div className="fxForm">
                <div className="fxForm__crcA">
                    <CurrencySelector
                        currencies={this.state.currencies}
                        current={this.state.currencyFrom}
                        onClick={(event,crcCode)=>FXActions.setCurrencyCodeA(crcCode)} />
                    <CurrencyBlock
                        className="fxForm__crc--from"
                        crcCode={this.state.currencyFrom}
                        crcBalance={this.state.userBalance.get(this.state.currencyFrom)}
                        onChange={(e)=>FXActions.setCurrencyAmtA(e.target.value)}
                        crcAmount={this.state.currencyFromAmt}
                        crcCompareCode={this.state.currencyTo}
                        crcCompareRate={FXStore.getCompareRate(this.state.currencyFrom, this.state.currencyTo)}
                    />
                </div>
                <div className="arrowBlock">
                    <div className="arrowBlock__arrow center-block"></div>
                </div>

                <div className="fxForm__crcB">
                    <CurrencySelector
                        currencies={this.state.currencies.setIn([this.state.currencyFrom, 'enabled'], false)}
                        current={this.state.currencyTo}
                        onClick={(event,crcCode)=>FXActions.setCurrencyCodeB(crcCode)}/>
                    <CurrencyBlock
                        className="fxForm__crc--to"
                        crcCode={this.state.currencyTo}
                        crcBalance={this.state.userBalance.get(this.state.currencyTo)}
                        onChange={(e)=>FXActions.setCurrencyAmtB(e.target.value)}
                        crcAmount={this.state.currencyToAmt}
                        crcCompareCode={this.state.currencyFrom}
                        crcCompareRate={FXStore.getCompareRate(this.state.currencyTo, this.state.currencyFrom)}
                    />
                </div>

                <div className="row">
                    <button
                        className={classnames("fxForm__btnConvert btn btn-default center-block input-lg", {
                            'fxForm__btnConvert--disabled': disableSubmit
                        })}
                        onClick={(e)=>{
                            if(disableSubmit === false) { FXActions.submit() }
                        }}
                    >
                        Exchange
                    </button>
                </div>
            </div>
        );
    }
}