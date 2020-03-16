import './CardResult.scss';

import React from 'react';

/* Component */
import CardResultTextItem from './CardResultTextItem';

/* Env */
import { API_URL } from 'env';

const CardResult = ({image, engine_type, texts, ...rest}) => (
  <div className="card-result" {...rest}>
    <div className="card-result__image">
      <img src={`${API_URL}/${image}`} alt="document"/>
    </div>
    <div className="card-result__text">
      <div className="title">Fields</div>
      {
        texts.map((text) => <CardResultTextItem key={text.field_name} _key={text.field_name} value={text.result} engine_type={engine_type} />)
      }
    </div>
  </div>
)

export default CardResult;
