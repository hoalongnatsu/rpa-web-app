import React, { Component } from 'react';
import ReactJson from 'react-json-view';

/* Env */
import { ENGINE } from 'constants.js';

export class CardResultTextItem extends Component {
  render() {
    const { _key, value, engine_type } = this.props;
    
    return (
      <div className="item">
        <div className="key text-truncate">{_key}</div>
        <div className="value">
          {
            engine_type === ENGINE.RESUME_PARSER ?
              <ReactJson src={JSON.parse(value)} collapsed={true} />
            :
              value
          }
        </div>
      </div>
    )
  }
}

export default CardResultTextItem;
