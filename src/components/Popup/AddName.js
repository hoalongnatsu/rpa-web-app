import './AddName.scss';

import React from 'react';

/* Component */
import Icon from 'components/Icon';

const AddName = ({top, left, show, dataFieldName, closePopup, onChangeDataFieldName, addDataFieldZoneORC}) => show ? (
  <div className="popup" style={{top, left}}>
    <div className="popup__header">
      Name
      <Icon name="squared-cross" onClick={closePopup} />
    </div>
    <div className="popup__body">
      <input
        type="text"
        className="form-control"
        value={dataFieldName}
        onChange={onChangeDataFieldName}
        onKeyPress={addDataFieldZoneORC}
        autoFocus
      />
    </div>
  </div>
) : ''


export default AddName;
