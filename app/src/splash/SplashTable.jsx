import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

class SplashTable extends React.Component {

  render() {
    return (
      <Table celled unstackable>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Logged into GitHub</Table.Cell>
            <Table.Cell>{this.props.authenticated ? 'True' : 'False'}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>GitHub Username</Table.Cell>
            <Table.Cell>{this.props.username}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>GitHub Repo</Table.Cell>
            <Table.Cell>{this.props.repo}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Local Directory</Table.Cell>
            <Table.Cell>{this.props.dir}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Local Directory Status</Table.Cell>
            <Table.Cell>{this.props.status}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

SplashTable.defaultProps = {
  authenticated: false,
  username: '',
  repo: '',
  dir: '',
  status: '',
};

SplashTable.propTypes = {
  authenticated: PropTypes.bool,
  username: PropTypes.string,
  repo: PropTypes.string,
  dir: PropTypes.string,
  status: PropTypes.string,
};

function mapStateToProps(state) {
  console.log('running mapStateToProps', state);
  return {
    authenticated: state.authenticated,
    username: state.username,
    repo: state.repo,
    dir: state.dir,
    status: state.status,
  };
}

export default connect(mapStateToProps)(SplashTable);
