import './index.scss';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Topbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md">
        <Link className="navbar-brand" to="/">Document Parse</Link>
        <button className="navbar-toggler" type="button">
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>
    )
  }
}

export default Topbar;
