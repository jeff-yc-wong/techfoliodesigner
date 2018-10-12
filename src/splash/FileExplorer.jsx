import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createTechFolioWindow, deleteFile, newTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';

function compareName(a, b) {
  if (a.fileName < b.fileName) return -1;
  if (a.fileName > b.fileName) return 1;
  return 0;
}

function compareType(a, b) {
  if (a.fileType < b.fileType) return -1;
  if (a.fileType > b.fileType) return 1;
  return 0;
}

function compareCommit(a, b) {
  //TODO make real comparison
  if (a.fileName < b.fileName) return -1;
  if (a.fileName > b.fileName) return 1;
  return 0;
}

function compareChange(a, b) {
  //TODO make real comparison
  if (a.fileName < b.fileName) return -1;
  if (a.fileName > b.fileName) return 1;
  return 0;
}

function handleSort(column) {
  //TODO make these toggles
  if (column === 'name') this.props.fileData.sort(compareName);
  if (column === 'type') this.props.fileData.sort(compareType);
  if (column === 'commit') this.props.fileData.sort(compareCommit);
  if (column === 'change') this.props.fileData.sort(compareChange);
}

function handleClick(action, fileType, fileName) {
  if (action === 'edit') return createTechFolioWindow({ fileType, fileName });
  if (action === 'delete') return deleteFile(fileType, fileName);
  return -1;
}

function newClick(fileType) {
  return newTechFolioWindow(fileType);
}

class FileExplorer extends React.Component {
  //TODO add state and arrows on column headers, make footer (create new) fixed (separate file?)
  render() {
    const fileData = this.props.fileData;
    return (
      <Grid divided={'vertically'}>
        <Grid.Row columns={'1'}>
          <Table celled unstackable striped sortable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign={'center'} onClick={() => handleSort('name')}>
                  File Name
                </Table.HeaderCell>
                <Table.HeaderCell textAlign={'center'} onClick={() => handleSort('type')}>
                  Type
                </Table.HeaderCell>
                <Table.HeaderCell textAlign={'center'} onClick={() => handleSort('commit')}>
                  Last Committed
                </Table.HeaderCell>
                <Table.HeaderCell textAlign={'center'} onClick={() => handleSort('change')}>
                  Changed
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {fileData.map(file => (
                <Table.Row key={file.key}>
                  <Table.Cell>
                    <Icon link name="edit" onClick={() => handleClick('edit', file.fileType, file.fileName)} />
                    <Icon link name="delete" onClick={() => handleClick('delete', file.fileType, file.fileName)} />
                    {file.fileName}
                  </Table.Cell>
                  <Table.Cell>
                    {file.fileType}
                  </Table.Cell>
                  <Table.Cell>
                    last committed here
                  </Table.Cell>
                  <Table.Cell negative={!!file.changed}>
                    {file.changed ? 'FILE CHANGED' : ''}
                  </Table.Cell>
                </Table.Row>))}
            </Table.Body>
          </Table>
        </Grid.Row>
        <Grid.Row columns={'2'}>
          <Grid.Column onClick={() => newClick({ fileType: 'projects' })}>
            <a href={'#'}><b>Create a new project</b></a>
          </Grid.Column>
          <Grid.Column onClick={() => newClick({ fileType: 'essays' })}>
            <a href={'#'}><b>Create a new essay</b></a>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

FileExplorer.defaultProps = {
  fileData: [],
  changed: false,
};

FileExplorer.propTypes = {
  fileData: PropTypes.arrayOf(PropTypes.object),
  changed: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    fileData: state.fileData,
    changed: state.changed,
  };
}

export default connect(mapStateToProps)(FileExplorer);
