import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import fs from 'fs-extra';
import CodeMirror from 'react-codemirror';

// require('');

export default class App extends React.Component {
  render() {
    const window = require('electron').remote.getCurrentWindow(); //eslint-disable-line
    window.setTitle(this.props.fileName);
    const filePath = path.join(this.props.directory, this.props.fileType, this.props.fileName);
    const value = fs.readFileSync(filePath, 'utf8');
    const options = { lineWrapping: true };
    return (
      <div>
        <CodeMirror value={value} onChange={this.updateCode} options={options} />
      </div>
    );
  }
}

App.propTypes = {
  directory: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
