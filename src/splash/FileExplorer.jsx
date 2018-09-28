import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createTechFolioWindow, deleteFile } from '../techfolioeditor/TechFolioEditorWindow';

function handleClick(action, fileType, fileName) {
  if (action === 'edit') createTechFolioWindow({ fileType, fileName });
  //if (action === 'delete') deleteFile(fileType, fileName);
}

class FileExplorer extends React.Component {
  render() {
    const projectObjects = this.props.projects.map((project) => {
      return ({ key: project, fileName: project, fileType: 'projects' });
    });
    const essayObjects = this.props.essays.map((essay) => {
      return ({ key: essay, fileName: essay, fileType: 'essays' });
    });
    function compare(a, b) {
      if (a.fileName < b.fileName) return -1;
      if (a.fileName > b.fileName) return 1;
      return 0;
    }
    const fileData = projectObjects.concat(essayObjects);
    fileData.sort(compare);
    return (
      <Table celled unstackable sortable>
        <Table.Header>
          <Table.Row>
            <Table.Cell>File Explorer</Table.Cell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fileData.map(file => (
            <Table.Row key={file.key}>
              <Table.Cell>{file.fileName}</Table.Cell>
              <Table.Cell>
                <Icon link name="edit" onClick={handleClick('edit', file.fileType, file.fileName)} />
                <Icon link name="delete" onClick={handleClick('delete', file.fileType, file.fileName)} />
              </Table.Cell>
            </Table.Row>))}
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
