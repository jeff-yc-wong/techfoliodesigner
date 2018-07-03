import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/github';
import 'brace/ext/language_tools';

export default class App extends React.Component {
  render() {
    const aceOptions = { };
    return (
      <div>
        <h2>Welcome to React 2!</h2>
        <h4>Dir: {this.props.techFolioDir}</h4>
        <h4>Type: {this.props.fileType}</h4>
        <h4>Name: {this.props.fileName}</h4>
        <AceEditor mode="markdown" theme="github" name="editor" fontSize={12} width="100%" setOptions={aceOptions} />
      </div>
    );
  }
}

App.propTypes = {
  techFolioDir: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
