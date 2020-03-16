import './index.scss';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

/* Component */
import CardRule from 'components/Rule/CardRule';

/* Mockup data */
// const rule = {
//   image: "static/images/f1007293-c2ef-4429-a0f7-e574d8b8dddf.png",
//   name: "Business_Card_Test",
//   _id: "5d884430bdf6339ee5c2649c",
//   filters: []
// }

export class Panel extends Component {

  state = {
    rule: null
  }

  componentWillMount() {
    const { data } = this.props.location;
    
    if (data) {
      this.setState({rule: data});
      return;
    }

    this.props.history.push('/')

    // this.setState({rule});
  }

  uploadDocument = (e) => {
    const filesUpload = [...e.target.files];
    
    const filesUploadPromise = filesUpload.map((fileUpload) => {
      const file = new FileReader();
      file.readAsDataURL(fileUpload);

      return new Promise((resolve) => {
        file.onload = (res) => {
          resolve({
            name: fileUpload.name,
            image: res.target.result,
          })
        }
      })
    })

    Promise.all(filesUploadPromise).then((data) => {
      const { rule } = this.state;
      this.props.history.push({
        pathname: '/parse',
        state: { rule, data }
      })
    })
  }

  _onDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.upload.classList.add('onDrag')
  }

  _onDragLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.upload.classList.remove('onDrag')
  }

  _onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const item = e.dataTransfer.items[0].webkitGetAsEntry();

    if (item.isFile) {
      const files = [...e.dataTransfer.files];

      const filesPromise = files.map((file) => {
        return new Promise((resolve) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = (res) => {
            resolve({
              name: file.name,
              image: res.target.result,
            })
          }
        })
      })

      Promise.all(filesPromise).then((data) => {
        const { rule } = this.state;
        this.props.history.push({
          pathname: '/parse',
          state: { rule, data }
        })
      })
    } else {
      const reader = item.createReader();
      reader.readEntries((entries) => {
        const entriesPromise = entries.map((entry) => {
          return new Promise((resolve) => {
            entry.file((file) => {
              const fileReader = new FileReader();
              fileReader.readAsDataURL(file);
              fileReader.onload = (res) => {
                resolve({
                  name: file.name,
                  image: res.target.result,
                })
              }
            })
          })
        })
  
        Promise.all(entriesPromise).then((data) => {
          const { rule } = this.state;
          this.props.history.push({
            pathname: '/parse',
            state: { rule, data }
          })
        })
      });
    }
  }

  render() {
    const { rule } = this.state;

    if (!rule) return <div>Loading...</div>

    return (
      <section className="upload-page container">
        <div className="upload-page__header">
          <CardRule {...rule} disable={true}  />
        </div>
        <div
          ref={(node) => this.upload = node}
          className="upload-page__container"
          onDragOver={this._onDragOver}
          onDragLeave={this._onDragLeave}
          onDrop={this._onDrop}
        >
          <div className="upload-page__view">
            <div className="upload-page__icon">
              <img src="/icon/upload.svg" alt="upload"/>
            </div>
            <div className="upload-page__title">Upload your document</div>
            <div className="upload-page__button">
              <label className="btn" htmlFor="document">Choose File</label>
            </div>
          </div>
          <input
            type="file"
            name="document"
            id="document"
            onChange={this.uploadDocument}
            accept={rule.engine_type === 1 ? ".pdf" : "image/*"}
            multiple
          />
        </div>
      </section>
    )
  }
}

export default withRouter(Panel);
