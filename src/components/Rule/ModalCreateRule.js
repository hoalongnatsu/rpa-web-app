import './ModalCreateRule.scss';

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

/* Components */
import Overlay from 'components/Loading/Overlay';

/* Actions */
import { add_rule } from 'actions/rules';

export class ModalCreateRule extends Component {

  state = {
    name: '',
    engine_type: 0,
    image: null,
    loading: false
  }

  onChange = (e) => {
    if (e.target.name !== "file") {
      this.setState({[e.target.name]: e.target.value})
      return;
    }

    const file = new FileReader();
    file.readAsDataURL(e.target.files[0]);

    file.onload = (res) => {
      this.setState({image: res.target.result});
    }
  }

  nextStep = () => {
    const { name, engine_type, image } = this.state;

    this.props.history.push({
      pathname: '/rules/create',
      state: { name, engine_type, image }
    })
  }
  
  render() {
    const { name, loading } = this.state;

    return (
      <div className="qh-modal__dialog">
        <div className="qh-modal__header">Create new rule</div>
        <div className="qh-modal__body">
          <div className="form-create-rule">
            <div className="form-group">
              <label>Rule name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={name}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <label>File</label>
              <input
                type="file"
                name="file"
                className="form-control-file"
                onChange={this.onChange}
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <div className="qh-modal__footer">
          <div className="qh-modal__btn" onClick={this.nextStep}>
            Next Step
          </div>
        </div>
        {
          loading ? <Overlay /> : ''
        }
      </div>
    )
  }
}

export default connect(null, { add_rule })(withRouter(ModalCreateRule));

