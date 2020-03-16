import './ListRule.scss';

import React, { Component, Fragment } from 'react';

/* Component */
import CardRule from './CardRule';
import ModalCreateRule from './ModalCreateRule';
import Icon from 'components/Icon';
import Modal from 'components/Modal';

export class ListRule extends Component {

  state = {
    showModal: false
  }

  showModal = () => {
    this.setState({showModal: true})
  }

  closeModal = () => {
    this.setState({showModal: false})
  }

  render() {
    const { data, showCreate } = this.props;
    const { showModal } = this.state;

    return (
      <Fragment>
        <div className="list-rule" to="/upload">
          {
            data.map((rule) => (
              <CardRule {...rule} key={rule.name} to={{
                pathname: "/upload",
                data: rule
              }} />
            ))
          }
          {
            showCreate ?
              <div className="list-rule__create" onClick={this.showModal}>
                <Icon className="icon" name="plus" />
                <div className="text">Create new</div>
              </div>
            :
              ''
          }
        </div>

        {
          showCreate ?
            <Modal show={showModal}>
              <ModalCreateRule closeModal={this.closeModal} />
            </Modal>
          :
            ''
        }
      </Fragment>
    )
  }
}

export default ListRule;
