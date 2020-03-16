import './ZoneORCList.scss';

import React from 'react';

/* Components */
import Icon from 'components/Icon';

const ZoneORCList = ({data, changeZoneORCFieldName, toggleZoneORCItem, saveZoneORCItem, editZoneORCItem, removeZoneORCItem}) => (
  data.map((zoneORCItem, index) => (
    <div className="data-fields__item boxing" key={zoneORCItem._id}>
      <div className="data-fields__item--name text-truncate">
        {
          zoneORCItem.edit ?
            <input
              type="text"
              value={zoneORCItem.field_name}
              onChange={(e) => changeZoneORCFieldName(e, index)}
            />
          :
            zoneORCItem.field_name
        }
      </div>
      <div className="data-fields__item--tools">
        <Icon name={zoneORCItem.show ? "eye-view" : "eye-hide"} onClick={() => toggleZoneORCItem(index)} />
        {
          zoneORCItem.edit ?
            <Icon onClick={() => saveZoneORCItem(index)} name="save" />
          :
            <Icon onClick={() => editZoneORCItem(index)} name="edit" />
        }
        <Icon name="trash" onClick={() => removeZoneORCItem(zoneORCItem._id)} />
      </div>
    </div>
  ))
)

export default ZoneORCList;
