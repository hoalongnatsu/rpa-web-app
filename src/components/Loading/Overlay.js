import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import './Overlay.scss';

import React from 'react';
import Loader from 'react-loader-spinner';

const Overlay = () => (
  <div className="overlay">
    <Loader
      type="Oval"
      color="white"
      height={100}
      width={100}
    />
  </div>
)

export default Overlay;
