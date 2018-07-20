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
            <Table.Cell>Authenticated</Table.Cell>
            <Table.Cell>{this.props.authenticated ? 'True' : 'False'}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Username</Table.Cell>
            <Table.Cell>{this.props.username}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Remote Repo</Table.Cell>
            <Table.Cell>{this.props.repo}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Local Dir</Table.Cell>
            <Table.Cell>{this.props.dir}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Status</Table.Cell>
            <Table.Cell>{this.props.status}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

SplashTable.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  dir: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    authenticated: state.authenticated,
    username: state.username,
    repo: state.repo,
    dir: state.dir,
    status: state.status,
  };
}

export default connect(mapStateToProps)(SplashTable);
