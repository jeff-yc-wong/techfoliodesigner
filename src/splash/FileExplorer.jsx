import React from 'react';
import PropTypes from 'prop-types';
import { Table, List } from 'semantic-ui-react';
import { connect } from 'react-redux';

class FileExplorer extends React.Component {

  render() {
    return (
      <Table celled unstackable sortable>
        <Table.Header>
          <Table.Row>
            <Table.Cell center align>File Explorer</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.props.projects.map(project => <Table.Row> <Table.Cell>{project}</Table.Cell></Table.Row>)}
          {this.props.essays.map(essay => <Table.Row><Table.Cell>{essay}</Table.Cell></Table.Row>)}
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
