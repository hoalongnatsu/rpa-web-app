import './ChooseKeyValueFilter.scss';

import React, { Component } from 'react';

import { arr_start, arr_end } from 'assets/json/key_filter.json';

/* Services */
import { rules } from 'services/rules';

export class ChooseKeyValueFilter extends Component {

  state = {
    name: '',
    type_start: '0',
    type_end: '',
    value_start: '',
    value_end: '',
    case_sensitive_start: 0,
    beginning_of_line_start: 0,
    case_sensitive_end: 0,
    beginning_of_line_end: 0,
    raw_parser: null,
    raw_result: []
  }

  componentWillMount() {
    const { image } = this.props;

    rules.get_raw_parser(image).then(({raw_parser}) => {
      this.getResultKeyFilter(raw_parser)
    })
  }

  componentDidMount() {
    this.value_start.addEventListener('change', () => {
      const { raw_parser } = this.state;

      this.getResultKeyFilter(raw_parser)
    })

    this.value_end.addEventListener('change', () => {
      const { raw_parser } = this.state;

      this.getResultKeyFilter(raw_parser)
    })
  }

  getResultKeyFilter = (raw_parser) => {
    const {
      type_start,
      type_end,
      value_start,
      value_end,
      case_sensitive_end,
      beginning_of_line_end,
      case_sensitive_start,
      beginning_of_line_start
    } = this.state;

    const rule = {
      raw_parser,
      filter: {
        type: 1,
        data: {
          type_start,
          type_end: value_end ? (type_end ? type_end : 3) : '',
          value_start,
          value_end,
          case_sensitive_end,
          beginning_of_line_end,
          case_sensitive_start,
          beginning_of_line_start
        }
      }
    }

    rules.review_key_word(rule).then(data => {
      const raw_result = [...new Set(data.result_end.split('\n'))];
      
      this.setState({raw_result, raw_parser})
    })
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    const { addDataFieldKeyFilter } = this.props;
    const {
      name,
      type_start,
      value_start,
      type_end,
      value_end,
      raw_result,
      case_sensitive_end,
      beginning_of_line_end,
      case_sensitive_start,
      beginning_of_line_start
    } = this.state;

    return (
      <div className="qh-modal__dialog">
        <div className="qh-modal__header">Choose key filter</div>
        <div className="qh-modal__body p-4">
          <div className="form-group">
            <label>Filter name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={name}
              onChange={this.onChange}
            />
          </div>
          <div className="form-group">
            <label>Define start position</label>
            <div className="row">
              <div className="col">
                <select
                  className="form-control"
                  name="type_start"
                  value={type_start}
                  onChange={this.onChange}
                >
                  {
                    arr_start.map((item) => (
                      <option value={item.type} key={item.type}>{item.type_name}</option>
                    ))
                  }
                </select>
              </div>
              <div className="col">
                <input
                  className="form-control"
                  name="value_start"
                  value={value_start}
                  onChange={this.onChange}
                  ref={(node) => this.value_start = node}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Define end position</label>
            <div className="row">
              <div className="col">
                <select
                  className="form-control"
                  name="type_end"
                  value={type_end}
                  onChange={this.onChange}
                >
                  {
                    arr_end.map((item) => (
                      <option value={item.type} key={item.type}>{item.type_name}</option>
                    ))
                  }
                </select>
              </div>
              <div className="col">
                <input
                  className="form-control"
                  name="value_end"
                  value={value_end}
                  onChange={this.onChange}
                  ref={(node) => this.value_end = node}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <table className="table table-striped table-review">
              <tbody>
                {
                  raw_result.map((item, index) => (
                    <tr key={item}>
                      <td>{index + 1}</td>
                      <td>{item}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="qh-modal__footer">
          <div
            className="qh-modal__btn"
            onClick={() => addDataFieldKeyFilter(
              name, type_start, value_start, type_end, value_end,
              case_sensitive_end, beginning_of_line_end, case_sensitive_start, beginning_of_line_start
            )}
          >
            Choose
          </div>
        </div>
      </div>
    )
  }
}

export default ChooseKeyValueFilter;
