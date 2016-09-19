import React from 'react';
import {PropTypes, Component} from 'react';
import crcFormatter from 'currency-formatter';
import classnames from 'classnames';

export class CurrencyBlock extends Component
{
    static propTypes = {
        crcCode:            PropTypes.string.isRequired,
        crcCompareCode:     PropTypes.string,
        crcCompareRate:     PropTypes.number,
        crcBalance:         PropTypes.number,
        onChange :          PropTypes.func,
        crcAmount:          PropTypes.oneOfType([
                                PropTypes.string,
                                PropTypes.number
                            ])
    };

    isValidInput = (value) => {
        return /^[0-9]*[.]{0,1}[0-9]*$/.test(value);
    };

    onInputChange = (event) => {
        if(!this.isValidInput(event.currentTarget.value)) {return;}
        this.props.onChange(event);
    };

    render()
    {
        return (
            <div className={classnames('fxForm__crc', this.props.className)}>
                <div className="row">
                    <div className="fxForm__crcName col-xs-6 col-md-6">
                        {this.props.crcCode}
                    </div>
                    <div className="fxForm__crcAmount col-xs-6 col-md-6 ">
                        <input className="form-control input-lg" value={this.props.crcAmount} placeholder="0.00" onChange={this.onInputChange}/>
                    </div>

                </div>
                <div className="row fxForm__crcBalanceRow">
                    <div className="fxForm__crcBalance col-xs-6">
                        You have {crcFormatter.format(this.props.crcBalance, {code: this.props.crcCode})}
                    </div>

                    {this.props.crcCompareCode &&
                        <div className="fxForm__crcRate text-right col-xs-6">
                            {crcFormatter.format(1, {code: this.props.crcCode})}
                            = {crcFormatter.format(this.props.crcCompareRate, {code: this.props.crcCompareCode})
                        }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

