import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createTechFolioWindow, deleteFile, newTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';

function handleClick(action, fileType, fileName) {
  if (action === 'edit') return createTechFolioWindow({ fileType, fileName });
  if (action === 'delete') {
    deleteFile(fileType, fileName);
    return 0;
  }
  return -1;
}

function newClick(fileType) {
  return newTechFolioWindow(fileType);
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
      <Table celled unstackable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={'2'} textAlign={'center'}>File Explorer</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fileData.map(file => (
            <Table.Row key={file.key}>
              <Table.Cell>{file.fileName}</Table.Cell>
              <Table.Cell textAlign={'right'}>
                <Icon link name="edit" onClick={() => handleClick('edit', file.fileType, file.fileName)} />
                <Icon link name="delete" onClick={() => handleClick('delete', file.fileType, file.fileName)} />
              </Table.Cell>
            </Table.Row>))}
          <Table.Row>
            <Table.Cell selectable onClick={() => newClick({ fileType: 'projects' })}>
              <a href={'#'}><b>Create a new project</b></a>
            </Table.Cell>
            <Table.Cell selectable onClick={() => newClick({ fileType: 'essays' })}>
              <a href={'#'}><b>Create a new essay</b></a>
            </Table.Cell>
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
