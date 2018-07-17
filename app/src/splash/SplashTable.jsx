import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

export default class SplashTable extends React.Component {

  render() {
    return (
      <Table celled unstackable>
        <Table.Body>
          <Table.Row>
            <Table.Cell collapsing>Token</Table.Cell>
            <Table.Cell collapsing>{this.props.token}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Username</Table.Cell>
            <Table.Cell collapsing>{this.props.username}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Remote Repo</Table.Cell>
            <Table.Cell collapsing>{this.props.repo}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Local Dir</Table.Cell>
            <Table.Cell collapsing>{this.props.dir}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell collapsing>Changed files?</Table.Cell>
            <Table.Cell collapsing>{this.props.dirty}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

SplashTable.propTypes = {
  token: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  dir: PropTypes.string.isRequired,
  dirty: PropTypes.string.isRequired,
};
