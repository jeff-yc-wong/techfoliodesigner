import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea } from 'semantic-ui-react';

export default class SplashLogs extends React.Component {

  render() {
    const logStrings = this.props.logs.map(entry => `${entry.timestamp}: ${entry.data}`);
    return (
      <Form>
        <Form.Field control={TextArea} label="Command Logs" value={logStrings.join('\n\n')} readOnly rows={10} />
      </Form>
    );
  }
}

SplashLogs.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.object).isRequired,
};
