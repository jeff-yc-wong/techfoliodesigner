import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import 'brace/mode/markdown';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import path from 'path';
import fs from 'fs-extra';

export default class App extends React.Component {
  render() {
    const window = require('electron').remote.getCurrentWindow();
    window.setTitle(this.props.fileName);
    const aceOptions = { resize: true };
    const filePath = path.join(this.props.techFolioDir, this.props.fileType, this.props.fileName);
    const value = fs.readFileSync(filePath, 'utf8');
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <AceEditor mode="markdown" theme="github" name="editor" fontSize={12} setOptions={aceOptions} value={value}/>
      </div>
    );
  }
}

App.propTypes = {
  techFolioDir: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
