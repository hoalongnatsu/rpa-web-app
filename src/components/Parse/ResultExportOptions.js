import './ResultExportOptions.scss';

import React, { Component } from 'react';
import { toXML } from 'jstoxml';
import { Parser } from 'json2csv';

export class ResultExportOptions extends Component {

  exportCsv = (jsonData) => {
    const fields = ['name', 'texts.field_name', 'texts.result'];
    const json2csvParser = new Parser({ fields, unwind: ['texts'] });
    const csvStr = json2csvParser.parse(jsonData);
    const dataUri = `data:text/csv;charset=utf-8,${csvStr}`;

    const exportFileDefaultName = 'data.csv';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  exportXML = (jsonData) => {
    const xmlStr = toXML({doc: jsonData}, {
      header: true,
      indent: ' '
    });
    const dataUri = `data:text/xml;charset=utf-8,${xmlStr}`;

    const exportFileDefaultName = 'data.xml';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  exportJson = (jsonData) => {
    const jsonStr = JSON.stringify(jsonData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonStr)}`;

    const exportFileDefaultName = 'data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  render() {
    const { jsonData } = this.props;

    return (
      <div className="result__export container">
        <div className="result__export-content">
          {/* <div className="result__export-format">
            <img className="icon" src="/icon/excel.svg" alt="excel"/>
            <div className="text">Excel</div>
          </div> */}
          <div className="result__export-format" onClick={() => this.exportCsv(jsonData)}>
            <img className="icon" src="/icon/csv.svg" alt="excel"/>
            <div className="text">CSV</div>
          </div>
          <div className="result__export-format" onClick={() => this.exportXML(jsonData)}>
            <img className="icon" src="/icon/xml.svg" alt="xml"/>
            <div className="text">XML</div>
          </div>
          <div className="result__export-format" onClick={() => this.exportJson(jsonData)}>
            <img className="icon" src="/icon/json.svg" alt="json"/>
            <div className="text">JSON</div>
          </div>
        </div>
      </div>
    )
  }
}

export default ResultExportOptions;
