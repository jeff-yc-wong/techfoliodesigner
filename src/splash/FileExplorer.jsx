import React from 'react';
import PropTypes from 'prop-types';
import { Table, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createTechFolioWindow, deleteFile, newTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';
import { setFileData } from '../redux/actions';

class FileExplorer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileData: this.props.fileData,
    };
    setFileData(this.props.fileData);
    this.newClick = this.newClick.bind(this);
  }

  /**
   * Creates a new essay or project file, then opens the Editor for that file
   *
   * @param fileType Type of file to make, either 'essay' or 'project'
   */
  newClick(fileType) {
    setFileData(this.props.fileData);
    this.setState({ fileData: this.props.fileData });
    newTechFolioWindow(fileType);
  }

  /**
   * Handles either a delete or edit action when pressing an icon in the file system UI
   *
   * @param action Either 'delete' or 'edit', depending on which action to do
   * @param fileType Type of file, either an 'essay' or 'project'
   * @param fileName Name of file
   * @returns {*}
   */
  handleClick(action, fileType, fileName) {
    if (action === 'edit') return createTechFolioWindow({ fileType, fileName });
    else if (action === 'delete') {
      deleteFile(fileType, fileName).then(
          () => {
            let type = 'not defined';
            fileType === 'essays' ? type = 'essay' : type = 'project'; // eslint-disable-line
            const index = this.state.fileData.map(file => file.key).indexOf(`${type}-${fileName}`);
            this.setState(this.state.fileData.splice(index, 1));
            return 0;
          },
      );
    }
    return -1; // this should never happen
  }

  // TODO make 'commit' column functional
  render() {
    const fileData = this.state.fileData;
    return (
      <div>
        <Table unstackable striped sortable basic>
          <Table.Body>
            {fileData.map(file => (
              <Table.Row key={file.key} negative={!!file.changed}>
                <Table.Cell width={6}>
                  {file.fileName}
                </Table.Cell>
                <Table.Cell width={2} textAlign={'center'}>
                  {file.fileType === 'projects' ?
                    <Icon name={'university'} /> : <Icon name={'file alternate outline'} /> }
                </Table.Cell>
                <Table.Cell width={2} textAlign={'center'}>
                  <Icon link name="edit" onClick={() => this.handleClick('edit', file.fileType, file.fileName)} />
                </Table.Cell>
                <Table.Cell width={2} textAlign={'center'}>
                  <Icon
                    link
                    name="delete"
                    onClick={() => this.handleClick('delete', file.fileType, file.fileName)}
                  />
                </Table.Cell>
                <Table.Cell width={4}>
                  {file.changed ? 'commitdate' : ''}
                </Table.Cell>
              </Table.Row>))}
          </Table.Body>
        </Table>
        <Table celled unstackable striped sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell selectable textAlign="center" onClick={() => this.newClick({ fileType: 'projects' })}>
                Create a new project
              </Table.HeaderCell>
              <Table.HeaderCell selectable textAlign="center" onClick={() => this.newClick({ fileType: 'essays' })}>
                Create a new essay
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        </Table>
      </div>
    );
  }
}

FileExplorer.defaultProps = {
  fileData: [],
  changed: null,
};

FileExplorer.propTypes = {
  fileData: PropTypes.arrayOf(PropTypes.object),
};

function mapStateToProps(state) {
  return {
    fileData: state.fileData,
    changed: state.changed,
  };
}

export default connect(mapStateToProps)(FileExplorer);
