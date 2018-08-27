import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

class LastModified extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  render() {
    return (
      <p>Last modified: {moment().format('LTS')}</p>
    );
  }
}

export default connect()(LastModified);
