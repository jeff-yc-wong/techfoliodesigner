import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import fs from 'fs-extra';
import { Controlled as CodeMirror } from 'react-codemirror2';
import jsonlint from 'jsonlint';
import { JSHINT } from 'jshint';

const fs = require('fs');
// const notifier = require('node-notifier');

require('codemirror/lib/codemirror.js');
require('codemirror/mode/css/css.js');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/json-lint');

require('../lib/autorefresh.ext');

const jsonlint = require('jsonlint');
const { clipboard } = require('electron');
const { ks } = require('node-key-sender');

export default class TechFolioEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onBeforeChange = this.onBeforeChange.bind(this);
    this.setWindowTitle = this.setWindowTitle.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.copy = this.copy.bind(this);
    this.paste = this.paste.bind(this);
    this.window = require('electron').remote.getCurrentWindow(); //eslint-disable-line
    this.window.setTitle(this.props.fileName);

    window.JSHINT = JSHINT; // eslint-disable-line
    window.jsonlint = jsonlint; // eslint-disable-line

    this.codeMirrorRef = null;
    this.filePath = path.join(this.props.directory, this.props.fileType, this.props.fileName);
    this.state = { value: fs.existsSync(this.filePath) ? fs.readFileSync(this.filePath, 'utf8') : `no ${this.filePath}`,
      fileChangedMarker: '' };
    this.mode = this.props.fileName.endsWith('.md') ? 'markdown' : 'application/json';
    const extraKeys = {};
    const saveKeyBinding = (process.platform === 'darwin') ? 'Cmd-S' : 'Ctrl-S';
    const copyKeyBinding = (process.platform === 'darwin') ? 'Cmd-C' : 'Ctrl-C';
    const pasteKeyBinding = (process.platform === 'darwin') ? 'Cmd-V' : 'Ctrl-V';
    extraKeys[saveKeyBinding] = () => this.saveFile();
    extraKeys[copyKeyBinding] = () => this.copy();
    extraKeys[pasteKeyBinding] = () => this.paste();
    this.options = {
      lineNumbers: true,
      lineWrapping: true,
      mode: this.mode,
      autoRefresh: { force: true },
      extraKeys,
    };
    if (this.mode === 'application/json') {
      this.options.gutters = ['CodeMirror-lint-markers'];
      this.options.lint = true;
    }
  }

  onBeforeChange(editor, data, value) {
    this.setState({ value });
    if (this.state.fileChangedMarker === '') {
      this.setState({ fileChangedMarker: '* ' });
      this.setWindowTitle();
    }
  }

  setWindowTitle() {
    this.window.setTitle(`${this.state.fileChangedMarker}${this.props.fileName}`);
  }

  // saveFile() {
  //   console.log('saveFile called');
  // }
  saveFile() {
    console.log('saveFile called'); //eslint-disable-line
    fs.writeFile(this.filePath, this.state.value, 'utf8', (err) => {
      if (err) {
        throw err;
      } else {
        try {
          jsonlint.parse(this.state.value);
        } catch (e) {
          notifier.notify({
            title: 'JSON IS NOT IN VALID FORMAT!',
            message: 'There is at least one JSON Error!!!',
          });
          console.log(e);
        }
        console.log(`File ${this.filePath} has been saved.`); // eslint-disable-line
        this.setState({ fileChangedMarker: '' });
        this.setWindowTitle();
      }
    });
  }

  copy() {  // eslint-disable-line
    console.log('copy called');
    // Disable eslint here, I know window is defined even though eslint says it isn't
    if (window.getSelection()) { // eslint-disable-line
      const selectedText = window.getSelection().toString(); // eslint-disable-line
      clipboard.writeText(selectedText);
    }
  }

  paste() { // eslint-disable-line
    console.log('PASTE!');
    if (window.getSelection()) { // eslint-disable-line
      const readString = clipboard.readText();
      // console.log(readString);
      // Throws error message: Uncaught TypeError: Cannot read property 'sendText' of undefined
      // However functionality still seems to work. Unsure what the solution should be.
      ks.sendText(readString);
    }
    // console.log(readString);
    // clipboardy.readSync();
  }

  render() {
    return (
      <div>
        <CodeMirror value={this.state.value} onBeforeChange={this.onBeforeChange} options={this.options} />
      </div>
    );
  }
}

TechFolioEditor.propTypes = {
  directory: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
