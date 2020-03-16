import './index.scss';

import React, { Component } from 'react';

/* Component */
import Item from './Item';

export class GuideProcess extends Component {
  render() {
    const { data } = this.props;

    return (
      <div className="guide-process">
        {
          data.map((guide) => (
            <Item {...guide} key={guide.step} />
          ))
        }
      </div>
    )
  }
}

export default GuideProcess;
