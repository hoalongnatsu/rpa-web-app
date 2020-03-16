import './index.scss';

import React from 'react';

const Loading = ({icon}) => (
  <div className="loading">
    <img src={icon ? `/icon/${icon}.svg` : "/icon/process.svg"} alt="process"/>
  </div>
)

export default Loading;
