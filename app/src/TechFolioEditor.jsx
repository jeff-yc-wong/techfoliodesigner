import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import fs from 'fs-extra';
import CodeMirror from 'react-codemirror';

require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');

export default class TechFolioEditor extends React.Component {
  render() {
    const window = require('electron').remote.getCurrentWindow(); //eslint-disable-line
    window.setTitle(this.props.fileName);
    const filePath = path.join(this.props.directory, this.props.fileType, this.props.fileName);
    const value = fs.readFileSync(filePath, 'utf8');
    const mode = this.props.fileName.endsWith('.md') ? 'markdown' : 'javascript';
    const options = { lineNumbers: true, lineWrapping: true, mode };
    return (
      <div>
        <CodeMirror value={value} onChange={this.updateCode} options={options} />
      </div>
    );
  }
}

TechFolioEditor.propTypes = {
  directory: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
