import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
// import fs from 'fs-extra';
import { Controlled as CodeMirror } from 'react-codemirror2';
import jsonlint from 'jsonlint';
import { JSHINT } from 'jshint';

const fs = require('fs');
const notifier = require('node-notifier');
const yamlFront = require('yaml-front-matter');
const report = require('vfile-reporter');
const remark = require('remark');
const styleGuide = require('remark-preset-lint-consistent');

require('codemirror/lib/codemirror.js');
require('codemirror/mode/css/css.js');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/json-lint');
require('../lib/autorefresh.ext');

// const jsonlint = require('jsonlint');

export default class TechFolioEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onBeforeChange = this.onBeforeChange.bind(this);
    this.setWindowTitle = this.setWindowTitle.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.window = require('electron').remote.getCurrentWindow(); //eslint-disable-line
    this.window.setTitle(this.props.fileName);
    window.JSHINT = JSHINT;  // eslint-disable-line
    this.codeMirrorRef = null;
    this.filePath = path.join(this.props.directory, this.props.fileType, this.props.fileName);
    this.state = { value: fs.existsSync(this.filePath) ? fs.readFileSync(this.filePath, 'utf8') : `no ${this.filePath}`,
      fileChangedMarker: '' };
    this.mode = this.props.fileName.endsWith('.md') ? 'markdown' : 'application/json';
    const extraKeys = {};
    const saveKeyBinding = (process.platform === 'darwin') ? 'Cmd-S' : 'Ctrl-S';
    extraKeys[saveKeyBinding] = () => this.saveFile();
    this.options = {
      lineNumbers: true,
      lineWrapping: true,
      mode: this.mode,
      autoRefresh: { force: true },
      extraKeys,
    };
    if (this.mode === 'application/json') {
      window.jsonlint = jsonlint; // eslint-disable-line
    }
    this.options.gutters = ['CodeMirror-lint-markers'];
    this.options.lint = true;
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

  saveFile() {
    console.log('saveFile called'); //eslint-disable-line
    fs.writeFile(this.filePath, this.state.value, 'utf8', (err) => {
      if (err) {
        throw err;
      } else {
        if (this.mode === 'application/json') {
          try {
            jsonlint.parse(this.state.value);
          } catch (e) {
            notifier.notify({
              title: 'JSON IS NOT IN VALID FORMAT!',
              message: 'There is at least one JSON Error!!!',
            });
          }
        } else {
          let isValidYAML = false;
          const lines = this.state.value.split('\n');
          if (lines[0] !== '---') {
            notifier.notify({
              title: 'YAML FRONT-MATTER ERROR',
              message: 'MISSING "---" on the first line!',
            });
          } else {
            for (let i = 1; i < lines.length; i++) {
              if (lines[i].includes('---')) {
                isValidYAML = true;

                break;
              }
            }
            if (isValidYAML) {
              try {
                const result = yamlFront.loadFront(this.state.value);
                const file = remark().use(styleGuide).processSync(result.__content);
                console.log(report(file));
              } catch (e) {
                notifier.notify({
                  title: 'YAML FRONT-MATTER ERROR',
                  message: e.message,
                });
              }
            } else {
              notifier.notify({
                title: 'YAML FRONT-MATTER ERROR',
                message: 'MISSING "---" at the end of YAML',
              });
            }
          }
        }
        console.log(`File ${this.filePath} has been saved.`); // eslint-disable-line
        this.setState({ fileChangedMarker: '' });
        this.setWindowTitle();
      }
    });
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
