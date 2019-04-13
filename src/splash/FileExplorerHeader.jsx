import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { _ } from 'underscore';
import mainStore from '../redux/mainstore';
import * as action from '../redux/actions';
import { getBioAsJson } from '../simplebioeditor/SimpleBioEditorWindow';


class FileExplorerHeader extends React.Component {

  constructor(props) {
    super(props);
    this.handleSort = this.handleSort.bind(this);
    this.state = { fileData: this.props.fileData, column: '', direction: '' };
  }

  handleSort(column) {
    // TODO make these toggles
    console.log(`Doing sort on ${column}`);
    if (this.state.column !== column) {
      this.setState({
        column,
        fileData: _.sortBy(this.state.fileData, [column]),
        direction: 'ascending',
      });
      // mainStore.dispatch(action.setFileData(_.sortBy(this.state.fileData, [column])));
      return;
    }
    this.setState({
      data: this.state.fileData.reverse(),
      direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
    });
    console.log(this.state.column, this.state.fileData);
    // mainStore.dispatch(action.setFileData(this.props.fileData.reverse()));
  }

  // TODO add state and arrows on column headers
  render() {
    return (
      <Table celled unstackable striped sortable basic>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              textAlign={'center'}
              width={2}
              sorted={this.props.column === 'type' ? this.props.direction : null}
              onClick={() => this.handleSort('type')}
            >
              Type
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign={'center'}
              width={6}
              sorted={this.props.column === 'name' ? this.props.direction : null}
              onClick={() => this.handleSort('name')}
            >
              File Name
            </Table.HeaderCell>

            <Table.HeaderCell textAlign={'center'} width={2}>
              Edit
            </Table.HeaderCell>
            <Table.HeaderCell textAlign={'center'} width={2}>
              Delete
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign={'center'}
              width={4}
              sorted={this.props.column === 'commit' ? this.props.direction : null}
              onClick={() => this.handleSort('commit')}
            >
              Modified
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>
    );
  }
}

FileExplorerHeader.defaultProps = {
  fileData: [],
  column: null,
  direction: null,
};

FileExplorerHeader.propTypes = {
  fileData: PropTypes.arrayOf(PropTypes.object),
  column: PropTypes.string,
  direction: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    fileData: state.fileData,
    column: state.column,
    direction: state.direction,
  };
}

export default connect(mapStateToProps)(FileExplorerHeader);
