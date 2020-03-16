import './ResultTable.scss';

import React from 'react';

/* Env */
import { API_URL } from 'env';

/* Constants */
import { STATUS } from 'constants.js';

const ResultTable = ({data, viewResult, checkAll, onChangeResultChecked}) => (
  <div className="result-content-table">
    <div className="result-table">
      <div className="result-table__header">
        <div className="result-table__row">
          <div className="result-table__col">
            <input
              type="checkbox"
              onChange={checkAll}
            />
          </div>
          <div className="result-table__col">Image</div>
          <div className="result-table__col">Name</div>
          <div className="result-table__col">Status</div>
          <div className="result-table__col">Action</div>
        </div>
      </div>
      <div className="result-table__body">
        {
          data.map((document, index) => (
            <div className="result-table__row" key={document.name}>
              <div className="result-table__col">
                <input
                  type="checkbox"
                  checked={document.checked}
                  onChange={() => onChangeResultChecked(document)}
                />
              </div>
              <div className="result-table__col result-table__col--image">
                {
                  document.status === STATUS.SUCCESS ?
                    <img src={`${API_URL}/${document.image}`} alt={document.name} />
                  :
                    <img src={document.image} alt={document.name} />
                }
              </div>
              <div className="result-table__col text-truncate">{document.name}</div>
              <div className="result-table__col">{document.status === STATUS.SUCCESS ? 'Success' : 'Error'}</div>
              <div className="result-table__col result-table__col--action">
                {
                  document.status === STATUS.SUCCESS ?
                    <img src="/icon/eye.svg" alt="view" onClick={() => viewResult(document, index)}/>
                  :
                    ''
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  </div>
)

export default ResultTable;
