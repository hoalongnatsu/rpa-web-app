import './index.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';

/* Component */
import Introduction from 'components/Introduction';
import ListRule from 'components/Rule/ListRule';

/* Actions */
import { get_all_rules } from 'actions/rules';

/* Contants */
import { ENGINE } from 'constants.js';

export class Home extends Component {

  componentWillMount() {
    if (this.props.structuredRules.length === 0) {
      this.props.get_all_rules();
    }
  }

  render() {
    const { structuredRules, unstructuredRules } = this.props;

    return (
      <section className="home-page container">
        <Introduction />

        <h2 className="h2">Unstructured documents</h2>
        <ListRule data={unstructuredRules} showCreate={false} />

        <h2 className="h2">Structured Documents</h2>
        <ListRule data={structuredRules} showCreate={true} />
      </section>
    )
  }
}

const mapStateToProps = ({rules}) => {

  const [structuredRules, unstructuredRules] = rules.reduce((item, current) => {
    if (current.engine_type === ENGINE.DOCUMENT_PARSER) {
      item[0].push(current)
    } else {
      item[1].push(current)
    }

    return item;
  }, [[], []])

  return {
    structuredRules,
    unstructuredRules
  }
}

export default connect(mapStateToProps, { get_all_rules })(Home);
