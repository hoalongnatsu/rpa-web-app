import React  from 'react';

 const Icon = ({name, link = '/icon/symbol.svg#icon-', ...rest}) => (
  <svg {...rest}>
    <use xlinkHref={link + name}></use>
  </svg>
);

export default Icon;