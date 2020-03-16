import './Progress.scss';

import React from 'react';

const Progress = ({progress, numberProcessedDocuments, totalDocument}) => (
  <div className="process-page__progress">
    <div className="process-page__text">{ numberProcessedDocuments } / { totalDocument }</div>
    <div className="progress">
      <div className="progress-bar" style={{width: `${progress}%`}}>{progress ? `${progress}%` : ''}</div>
    </div>
  </div>
)

export default Progress;
