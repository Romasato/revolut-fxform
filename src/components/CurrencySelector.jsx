import React from 'react';
import {PropTypes, Component} from 'react';
import classnames from 'classnames';
import Immutable from 'immutable';

export class CurrencySelector extends Component
{
    static propTypes = {
        currencies: PropTypes.instanceOf(Immutable.Map).isRequired,
        current:    PropTypes.string,
        onClick:    PropTypes.func,
    };

    render()
    {
        return (
            <div className={classnames('crcSelector', this.props.className)}>
                <div className="row">
                    {this.props.currencies.map((crcObj,crcCode)=>{
                        let isEnabled = crcObj.get('enabled') === true;
                        return (<div
                            className={classnames('crcSelector__crc', {
                                    'crcSelector__crc--active': this.props.current === crcCode,
                                    'crcSelector__crc--disabled': !isEnabled
                                })}
                            key={crcCode}
                            title={isEnabled ? 'Select currency' : 'Cannot convert to the same currency'}
                            onClick={(event, key)=>{if(crcObj.get('enabled')) this.props.onClick(event, crcCode)}} >{crcCode}</div>);
                    })}
                </div>
            </div>
        );
    }
}

