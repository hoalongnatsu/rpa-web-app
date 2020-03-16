import './ResultLoading.scss';

import React from 'react';

/* Component */
import Loading from 'components/Loading';

const ResultLoading = ({currentProcessingDocument}) => (
  <div className="result__loading">
    <div className="loading">
      <Loading />
    </div>
    <div className="text text-truncate">Processing { currentProcessingDocument }</div>
  </div>
)

export default ResultLoading;
