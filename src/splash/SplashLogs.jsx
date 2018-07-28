import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea } from 'semantic-ui-react';
import { connect } from 'react-redux';


class SplashLogs extends React.Component {

  render() {
    const logStrings = this.props.logs.map(entry => `${entry.timestamp}: ${entry.data}`);
    return (
      <Form>
        <Form.Field control={TextArea} label="Command Logs" value={logStrings.join('\n')} readOnly rows={10} />
      </Form>
    );
  }
}

SplashLogs.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(state) {
  return {
    logs: state.logs,
  };
}

export default connect(mapStateToProps)(SplashLogs);
