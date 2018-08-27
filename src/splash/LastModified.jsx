import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

class LastModified extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { date: new Date() };
  // }

  // componentDidMount() {
  //   this.timerID = setInterval(
  //           () => this.tick(),
  //           1000,
  //       );
  // }
  //
  // componentWillUnmount() {
  //   clearInterval(this.timerID);
  // }
  //
  // tick() {
  //   this.setState({
  //     date: new Date(),
  //   });
  // }

  render() {
    return (
     // <p>{this.state.date.toLocaleTimeString()}</p>
      <p>Last modified: {moment().format('LTS')}</p>
    );
  }
}

export default connect()(LastModified);
