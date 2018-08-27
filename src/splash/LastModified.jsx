import React from 'react';
import moment from 'moment';

class LastModified extends React.Component {
  render() {
    return (
      <p>{moment.format()}</p>
    );
  }
}
