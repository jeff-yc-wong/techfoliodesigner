import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';

class FileExplorer extends React.Component {

  render() {
    return (
      <Table celled unstackable>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Projects</Table.Cell>
            <Table.Cell>Essays</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>{this.props.projects}</Table.Cell>
            <Table.Cell>{this.props.essays}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

FileExplorer.defaultProps = {
  projects: [],
  essays: [],
};

FileExplorer.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  essays: PropTypes.arrayOf(PropTypes.object),
};

function mapStateToProps(state) {
  return {
    projects: state.projects,
    essays: state.essays,
  };
}

export default connect(mapStateToProps)(FileExplorer);
