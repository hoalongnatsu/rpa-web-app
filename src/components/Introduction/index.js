import './index.scss';

import React, { Component } from 'react';

/* Component */
import GuideProcess from 'components/GuideProcess';

/* Mockup data */
const guides = [
  {
    icon: '/icon/hiring.svg',
    step: 1,
    content: 'Choose your rules'
  },
  {
    icon: '/icon/file-upload.svg',
    step: 2,
    content: 'Upload your documents'
  },
  {
    icon: '/icon/information.svg',
    step: 3,
    content: 'Parse process'
  },
]

export class Introduction extends Component {
  render() {
    return (
      <div className="introduction">
        <h2 className="h2 introduction__title">Benefits</h2>
        <div className="introduction__content">Automated processing of all kinds of application documents</div>
        
        <GuideProcess data={guides} />
      </div>
    )
  }
}

export default Introduction;
