import './CardRule.scss';

import React from 'react';
import { Link } from 'react-router-dom';

/* Env */
import { API_URL } from 'env';

const CardRule = ({image, name, content, disable, ...rest}) => disable ? (
  <div className="card-rule disable" {...rest}>
    <div className="card-rule__icon">
      <img src={`${API_URL}/${image}`} alt={name}/>
    </div>
    <div className="card-rule__text">
      <div className="card-rule__title text-truncate">{name}</div>
    </div>
  </div>
) : (
  <Link className="card-rule" {...rest}>
    <div className="card-rule__icon">
      <img src={`${API_URL}/${image}`} alt={name}/>
    </div>
    <div className="card-rule__text">
      <div className="card-rule__title text-truncate">{name}</div>
    </div>
  </Link>
)

export default CardRule
