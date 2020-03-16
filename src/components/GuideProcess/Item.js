import React from 'react';

const Item = ({icon, step, content}) => (
  <div className="guide-process__item">
    <div className="guide-process__icon">
      <img src={icon} alt={content}/>
    </div>
    <div className="guide-process__step">{step}</div>
    <div className="guide-process__text">
      {content}
    </div>
  </div>
)

export default Item;
