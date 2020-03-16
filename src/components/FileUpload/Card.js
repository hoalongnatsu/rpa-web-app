import './Card.scss';

import React from 'react';

const Card = ({name, src}) => (
  <div className="card-file-upload">
    <div className="card-file-upload__image">
      <img src={src} alt={name}/>
    </div>
    <div className="card-file-upload__name text-truncate">
      {name}
    </div>
    <div className="card-file-upload__tools">
      <img src="/icon/trash.svg" alt="trash icon"/>
    </div>
  </div>
)

export default Card
