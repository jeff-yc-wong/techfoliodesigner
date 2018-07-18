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
            <Table.Cell collapsing>Status</Table.Cell>
            <Table.Cell collapsing>{this.props.status}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

SplashTable.defaultProps = {
  token: '',
  username: '',
  repo: '',
  dir: '',
  status: '',
};

SplashTable.propTypes = {
  token: PropTypes.string,
  username: PropTypes.string,
  repo: PropTypes.string,
  dir: PropTypes.string,
  status: PropTypes.string,
};
