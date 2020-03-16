import './List.scss';

import React, { Component } from 'react';

/* Component */
import CardFileUpload from './Card';

export class List extends Component {
  render() {
    const { data } = this.props;

    return (
      <div className="list-file-upload">
        {
          data.map((file) => (
            <CardFileUpload {...file} key={file.name} />
          ))
        }
      </div>
    )
  }
}

export default List;
