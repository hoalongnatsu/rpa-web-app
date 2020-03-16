import './ResultToolbar.scss';

import React from 'react';

const ResultToolbar = ({toggleExport}) => (
  <div className="result__toolbar container">
    <div className="btn--export" onClick={toggleExport}>
      <img src="/icon/export.svg" alt="export"/>
      Export
    </div>
  </div>
)

export default ResultToolbar
