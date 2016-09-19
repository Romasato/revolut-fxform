import React from 'react';
import {PropTypes, Component} from 'react';
import FXActions from '../actions/FXActions';
import Immutable from 'immutable';
import crcFormatter from 'currency-formatter';

export class FXResult extends Component {

    static propTypes = {
        result: PropTypes.instanceOf(Immutable.Map).isRequired
    };

    onButtonClick = (e)=>{
        FXActions.reset();
    };

    render()
    {
        var strFrom = crcFormatter.format(this.props.result.getIn(['params','amt']), {code: this.props.result.getIn(['params','from'])});
        var strTo = crcFormatter.format(this.props.result.get('amount'), {code: this.props.result.getIn(['params','to'])});

        return <div className="fxResult">
            <h2>A success!</h2>
            <p>
                You exchanged <span className="fxResult__crc">{strFrom}</span> to <span className="fxResult__crc">{strTo}</span> at a rate of <span className="fxResult__rate">{this.props.result.get('rate')}</span>.
            </p>

            <button
                className="btn btn-default center-block input-lg"
                onClick={this.onButtonClick}>
                Great!
            </button>
        </div>
    }
}