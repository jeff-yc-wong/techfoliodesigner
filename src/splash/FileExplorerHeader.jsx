import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { _ } from 'underscore';
import mainStore from '../redux/mainstore';
import * as action from '../redux/actions';

class FileExplorerHeader extends React.Component {
  handleSort(column) {
    // TODO make these toggles
    if (this.props.column !== column) {
      this.setState({
        column,
        fileData: _.sortBy(this.props.fileData, [column]),
        direction: 'ascending',
      });
      mainStore.dispatch(action.setFileData(_.sortBy(this.props.fileData, [column])));
      return;
    }
    this.setState({
      data: this.props.fileData.reverse(),
      direction: this.props.direction === 'ascending' ? 'descending' : 'ascending',
    });
    mainStore.dispatch(action.setFileData(this.props.fileData.reverse()));
  }

  // TODO add state and arrows on column headers, make footer (create new) fixed (separate file?)
  render() {
    return (
      <Table celled unstackable striped sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              textAlign={'center'}
              width={6}
              sorted={this.props.column === 'name' ? this.props.direction : null}
              onClick={() => this.handleSort('name')}
            >
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign={'center'}
              width={2}
              sorted={this.props.column === 'type' ? this.props.direction : null}

              onClick={() => this.handleSort('type')}
            >
              Type
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
              Committed
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
