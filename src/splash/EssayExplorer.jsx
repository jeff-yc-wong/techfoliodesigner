import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createTechFolioWindow, deleteFile, newTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';

function handleClick(action, fileType, fileName) {
  if (action === 'edit') return createTechFolioWindow({ fileType, fileName });
  if (action === 'delete') return deleteFile(fileType, fileName);
  return -1;
}

function newClick(fileType) {
  return newTechFolioWindow(fileType);
}

class EssayExplorer extends React.Component {
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
      <Grid divided={'vertically'}>
        <Grid.Row columns={'1'}>
          <Grid.Column>
            <Table celled unstackable striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell textAlign={'center'}>Essays</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {essayObjects.map(file => (
                  <Table.Row key={file.key}>
                    <Table.Cell>
                      <Icon link name="edit" onClick={() => handleClick('edit', file.fileType, file.fileName)}/>
                      <Icon link name="delete" onClick={() => handleClick('delete', file.fileType, file.fileName)}/>
                      {file.fileName}
                    </Table.Cell>
                  </Table.Row>))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={'2'}>
          <Grid.Column selectable onClick={() => newClick({ fileType: 'projects' })}>
            <a href={'#'}><b>Create a new project</b></a>
          </Grid.Column>
          <Grid.Column selectable onClick={() => newClick({ fileType: 'essays' })}>
            <a href={'#'}><b>Create a new essay</b></a>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

EssayExplorer.defaultProps = {
  projects: [],
  essays: [],
};

EssayExplorer.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.string),
  essays: PropTypes.arrayOf(PropTypes.string),
};

function mapStateToProps(state) {
  return {
    projects: state.projects,
    essays: state.essays,
  };
}

export default connect(mapStateToProps)(EssayExplorer);
