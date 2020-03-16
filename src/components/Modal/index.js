import './index.scss';

import React, { PureComponent } from 'react';

export class Modal extends PureComponent {

  state = {
    show: false
  }

  componentWillMount() {
    const { show } = this.props;
    this.setState({show})
  }

  close = (e) => {
    if (e.target.matches('.qh-modal')) {
      this.setState({show: false});
      document.querySelector('body').style.overflow = 'initial';

      if (this.props.afterCloseModal) {
        this.props.afterCloseModal();
      }
    }
  }

  componentWillReceiveProps({show}) {
    this.setState({show})

    if (show) {
      document.querySelector('body').style.overflow = 'hidden';
      return;
    }

    document.querySelector('body').style.overflow = 'initial';
  }

  render() {
    const { show } = this.state;

    return (
      show ?
        <div
          className="qh-modal"
          onClick={(e) => this.close(e)}
        >
          {this.props.children}
        </div>
      :
        ''
    )
  }
}

export default Modal;
