import './index.scss';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

/* Component */
import Modal from 'components/Modal';
import ResultView from 'components/Parse/ResultView';
import ResultLoading from 'components/Parse/ResultLoading';
import ResultTable from 'components/Parse/ResultTable';
import ResultToolbar from 'components/Parse/ResultToolbar';
import ResultExportOptions from 'components/Parse/ResultExportOptions';
import Progress from 'components/Parse/Progress';

/* Service */
import { core } from 'services/core';

// const data = [{
//   name: "CV1",
//   src: "/images/idcard_example_01.jpg",
// }, {
//   name: "CV2",
//   src: "/images/idcard_example_02.jpg",
// }, {
//   name: "CV3",
//   src: "/images/idcard_example_03.png",
// }];

// const results = [{
//   name: "idcard_example4.jpg",
//   image: "/images/idcard_example_02.jpg",
//   status: 1,
//   checked: false,
//   texts: [{
//     _key: 'Id',
//     value: '000-000-000'
//   }, {
//     _key: 'Name',
//     value: 'Evan Rachel Wood'
//   }, {
//     _key: 'Gender',
//     value: 'Female'
//   }, {
//     _key: 'Born',
//     value: '7 September'
//   }, {
//     _key: 'Location',
//     value: 'North Carolina, USA'
//   }]
// }, {
//   name: "CV2",
//   image: "/images/idcard_example_01.jpg",
//   status: 1,
//   checked: false,
//   texts: [{
//     _key: 'Id',
//     value: '000-000-000'
//   }, {
//     _key: 'Name',
//     value: 'Evan Rachel Wood'
//   }, {
//     _key: 'Gender',
//     value: 'Female'
//   }, {
//     _key: 'Born',
//     value: '7 September'
//   }, {
//     _key: 'Location',
//     value: 'North Carolina, USA'
//   }]
// }, {
//   name: "CV3",
//   image: "/images/idcard_example_03.png",
//   status: 1,
//   checked: false,
//   texts: [{
//     _key: 'Id',
//     value: '000-000-000'
//   }, {
//     _key: 'Name',
//     value: 'Evan Rachel Wood'
//   }, {
//     _key: 'Gender',
//     value: 'Female'
//   }, {
//     _key: 'Born',
//     value: '7 September'
//   }, {
//     _key: 'Location',
//     value: 'North Carolina, USA'
//   }]
// }];

export class Parse extends Component {

  state = {
    loading: true,
    totalDocument: null,
    currentProcessingDocument: null,
    numberProcessedDocuments: 0,
    progress: 0,
    results: [],
    result: null,
    indexActiveDocument: 0,
    showExport: false,
  }

  componentWillMount() {
    // Get rule and data from route
    const { state } = this.props.location;

    if (state) {
      const { rule, data } = state;
      this.setState({totalDocument: data.length});
      this.parseProgress(rule, data, 0);
      return;
    }

    this.props.history.push('/')

    /* Mockup */
    // this.setState({
    //   loading: false,
    //   totalDocument: 3,
    //   numberProcessedDocuments: 3,
    //   progress: 100,
    //   currentProcessingDocument: "CV1",
    //   results: results
    // });
  }

  parseProgress = (rule, data, index) => {
    // Check finish
    if (index >= data.length) {
      this.setState({loading: false});
      return;
    }

    // Set name for current processing document
    this.setState({currentProcessingDocument: data[index].name});

    core.parse(rule, data[index]).then((res) => {
      const { totalDocument, results } = this.state;
      const newResults = [...results, res];
      const numberProcessedDocuments = newResults.length;
      const progress = Math.ceil((numberProcessedDocuments / totalDocument) * 100);

      this.setState({results: newResults, numberProcessedDocuments, progress});

      this.parseProgress(rule, data, index + 1);
    })
  }

  /* Export function */
  toggleExport = () => {
    const { showExport } = this.state;
    this.setState({showExport: !showExport})
  }

  checkAll = (e) => {
    let newResults = [...this.state.results];

    newResults = newResults.map((result) => {
      result.checked = e.target.checked;
      return result
    })

    this.setState({results: newResults})
  }

  onChangeResultChecked = (document) => {
    let newResults = [...this.state.results];

    newResults = newResults.map((result) => {
      if (result.name === document.name) { result.checked = !result.checked }
      return result;
    })
    
    this.setState({results: newResults})
  }

  /* Result function */
  viewResult = (result, index) => {
    this.setState({result, indexActiveDocument: index});
  }

  closeViewResult = () => {
    this.setState({result: null});
  }

  render() {
    const {
      totalDocument,
      numberProcessedDocuments,
      currentProcessingDocument,
      progress,
      results,
      loading,
      result,
      showExport,
    } = this.state;

    return (
      <section className="process-page">
        <div className="result">
          {
            loading ?
              <Progress
                totalDocument={totalDocument}
                numberProcessedDocuments={numberProcessedDocuments}
                progress={progress}
              />
            :
              ''
          }
          {
            loading ?
              <ResultLoading currentProcessingDocument={currentProcessingDocument} />
            :
              <ResultToolbar toggleExport={this.toggleExport} />
          }
          {
            showExport ? <ResultExportOptions jsonData={results.filter((result) => result.checked)} /> : ''
          }
          <div className="result__content container">
            <ResultTable
              data={results}
              viewResult={this.viewResult}
              checkAll={this.checkAll}
              onChangeResultChecked={this.onChangeResultChecked}
            />
          </div>
        </div>

        <Modal
          show={result ? true : false}
          afterCloseModal={this.closeViewResult}
        >
          <div className="qh-modal__dialog qh-modal__dialog--full">
            <div className="qh-modal__body">
              <ResultView document={result} closeViewResult={this.closeViewResult} />
            </div>
          </div>
        </Modal>
      </section>
    )
  }
}

export default withRouter(Parse);
