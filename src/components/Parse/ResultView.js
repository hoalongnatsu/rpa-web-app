import './ResultView.scss';

import React from 'react';

/* Component */
import CardResult from './CardResult';

const ResultView = ({document, closeViewResult}) => (
  <div className="result__view">
    <div className="result__header">
      <div className="result__title text-truncate">{document.name}</div>
      <div className="result__tools">
        <img src="/icon/export.svg" alt="export"/>
        <img src="/icon/close.svg" alt="exit" onClick={closeViewResult}/>
      </div>
    </div>
    {
      document ? <CardResult {...document} /> : ''
    }
  </div>
)

export default ResultView
