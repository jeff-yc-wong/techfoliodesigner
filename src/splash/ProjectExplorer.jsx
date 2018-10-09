import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createTechFolioWindow, deleteFile } from '../techfolioeditor/TechFolioEditorWindow';

function handleClick(action, fileType, fileName) {
  if (action === 'edit') return createTechFolioWindow({ fileType, fileName });
  if (action === 'delete') return deleteFile(fileType, fileName);
  return -1;
}

class ProjectExplorer extends React.Component {
  render() {
    const projectObjects = this.props.projects.map((project) => {
      return ({ key: `project-${project}`, fileName: project, fileType: 'projects' });
    });
    const essayObjects = this.props.essays.map((essay) => {
      return ({ key: `essay-${essay}`, fileName: essay, fileType: 'essays' });
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
            <Table.HeaderCell textAlign={'center'}>Projects</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {projectObjects.map(file => (
            <Table.Row key={file.key}>
              <Table.Cell>
                <Icon link name="edit" onClick={() => handleClick('edit', file.fileType, file.fileName)} />
                <Icon link name="delete" onClick={() => handleClick('delete', file.fileType, file.fileName)} />
                {file.fileName}
              </Table.Cell>
            </Table.Row>))}
        </Table.Body>
      </Table>
    );
  }
}

ProjectExplorer.defaultProps = {
  projects: [],
  essays: [],
};

ProjectExplorer.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.string),
  essays: PropTypes.arrayOf(PropTypes.string),
};

function mapStateToProps(state) {
  return {
    projects: state.projects,
    essays: state.essays,
  };
}

export default connect(mapStateToProps)(ProjectExplorer);
