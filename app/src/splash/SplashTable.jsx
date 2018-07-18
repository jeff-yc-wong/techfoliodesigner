import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

export default class SplashTable extends React.Component {

  render() {
    return (
      <Table celled unstackable>
        <Table.Body>
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

SplashTable.defaultProps = {
  username: '',
  repo: '',
  dir: '',
  status: '',
};

SplashTable.propTypes = {
  username: PropTypes.string,
  repo: PropTypes.string,
  dir: PropTypes.string,
  status: PropTypes.string,
};
