import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createTechFolioWindow, deleteFile } from '../techfolioeditor/TechFolioEditorWindow';
import mainStore from '../redux/mainstore';
import { deleteFileData } from '../redux/actions';

const electron = require('electron');

class FileExplorer extends React.Component {
  handleClick(action, fileType, fileName) { // TODO use this.props here and modify the state elsewhere(?)
    if (action === 'edit') return createTechFolioWindow({ fileType, fileName });
    else if (action === 'delete') {
      const done = deleteFile(fileType, fileName);
      if (done) {
        if (fileType === 'essays') {
          const index = this.props.fileData.indexOf({ key: `essay-${fileName}`, fileType, fileName });
          console.log(index);
          this.props.fileData.splice(index, 1);
        } else {
          const index = this.props.fileData.indexOf({ key: `project-${fileName}`, fileType, fileName });
          console.log(index);
          this.props.fileData.splice(index, 1);
        }
        console.log(this.props.fileData);
        return 0;
      }
    } else return -1; // this should never happen
  }
  // TODO make 'commit' column functional
  render() {
    const fileData = this.props.fileData;
    return (
      <Table unstackable striped sortable basic>
        <Table.Body>
          {fileData.map(file => (
            <Table.Row key={file.key} negative={!!file.changed}>
              <Table.Cell width={6}>
                {file.fileName}
              </Table.Cell>
              <Table.Cell width={2} textAlign={'center'}>
                {file.fileType === 'projects' ? <Icon name={'university'} /> : <Icon name={'file alternate outline'} />}
              </Table.Cell>
              <Table.Cell width={2} textAlign={'center'}>
                <Icon link name="edit" onClick={() => this.handleClick('edit', file.fileType, file.fileName)} />
              </Table.Cell>
              <Table.Cell width={2} textAlign={'center'}>
                <Icon link name="delete" onClick={() => this.handleClick('delete', file.fileType, file.fileName)} />
              </Table.Cell>
              <Table.Cell width={4}>
                {file.changed ? 'commitdate' : ''}
              </Table.Cell>
            </Table.Row>))}
        </Table.Body>
      </Table>
    );
  }
}

FileExplorer.defaultProps = {
  fileData: [],
  changed: null,
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
