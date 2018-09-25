import React from 'react';
import PropTypes from 'prop-types';
import { Table, List } from 'semantic-ui-react';
import { connect } from 'react-redux';

class FileExplorer extends React.Component {

  render() {
    return (
      <Table celled unstackable>
        <Table.Header>
          <Table.Row>
            <Table.Cell width="8">Projects</Table.Cell>
            <Table.Cell width="8">Essays</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell><List>{this.props.projects}</List></Table.Cell>
            <Table.Cell><List>{this.props.essays}</List></Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>Create a new project</Table.Cell>
            <Table.Cell>Create a new essay</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

FileExplorer.defaultProps = {
  projects: [],
  essays: [],
};

FileExplorer.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.string),
  essays: PropTypes.arrayOf(PropTypes.string),
};

function mapStateToProps(state) {
  return {
    projects: state.projects,
    essays: state.essays,
  };
}

export default connect(mapStateToProps)(FileExplorer);
