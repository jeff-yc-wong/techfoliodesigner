import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
// import fs from 'fs-extra';
import { Controlled as CodeMirror } from 'react-codemirror2';
import cm from 'codemirror';
import jsonlint from 'jsonlint';
import { JSHINT } from 'jshint';
import SplitPane from 'react-split-pane';

const { dialog } = require('electron').remote;
const Typo = require('typo-js');
const fs = require('fs');
const yamlFront = require('yaml-front-matter');
const markdownlint = require('markdownlint');
const md = require('markdown-it')();

const mdLintOptions = {
  'strings': { // eslint-disable-line
    'mdString': '', // eslint-disable-line
  },
};

function markerMaker() {
  let markerElt = document.createElement('div'); // eslint-disable-line
  let markerError = document.createElement('div'); // eslint-disable-line

  markerElt.className = 'CodeMirror-gutter-elt';
  markerError.className = 'CodeMirror-lint-marker-error';
  markerElt.appendChild(markerError);

  return markerElt;
}

require('codemirror/lib/codemirror.js');
require('codemirror/mode/css/css.js');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
require('codemirror/addon/mode/overlay');
require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/json-lint');
require('../lib/autorefresh.ext');

export default class TechFolioEditor extends React.Component {
  constructor(props) {
    super(props);
    this.instance = null;
    this.onBeforeChange = this.onBeforeChange.bind(this);
    this.setWindowTitle = this.setWindowTitle.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.window = require('electron').remote.getCurrentWindow(); //eslint-disable-line
    this.window.setTitle(this.props.fileName);
    window.JSHINT = JSHINT;  // eslint-disable-line
    this.codeMirrorRef = null;
    this.filePath = path.join(this.props.directory, this.props.fileType, this.props.fileName);
    this.state = {
      value: fs.existsSync(this.filePath) ? fs.readFileSync(this.filePath, 'utf8') : `no ${this.filePath}`,
      fileChangedMarker: '',
    };
    this.mode = this.props.fileName.endsWith('.md') ? 'spell-check' : 'application/json';
    const extraKeys = {};
    const saveKeyBinding = (process.platform === 'darwin') ? 'Cmd-S' : 'Ctrl-S';
    // const copyKeyBinding = (process.platform === 'darwin') ? 'Cmd-C' : 'Ctrl-C';
    // const pasteKeyBinding = (process.platform === 'darwin') ? 'Cmd-V' : 'Ctrl-V';
    extraKeys[saveKeyBinding] = () => this.saveFile();
    // extraKeys[copyKeyBinding] = () => this.copy();
    // extraKeys[pasteKeyBinding] = () => this.paste();
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
    this.options.gutters = ['note-gutter', 'CodeMirror-lint-markers'];
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

  handleChange(value) {
    this.setState({ value });
  }

  saveFile() {
    // console.log('saveFile called'); //eslint-disable-line
    fs.writeFile(this.filePath, this.state.value, 'utf8', (err) => {
      if (err) {
        throw err;
      } else {
        if (this.mode === 'application/json') {
          try {
            jsonlint.parse(this.state.value);
          } catch (e) {
            dialog.showErrorBox('JSON File is not in a valid format!', 'There is at least one JSON error!');
          }
        } else {
          this.instance.clearGutter('CodeMirror-lint-markers');
          let isValidYAML = false;
          const lines = this.state.value.split('\n');
          if (lines[0] !== '---') {
            dialog.showErrorBox('YAML front-matter is not in a valid format!', 'MISSING "---" at the start of YAML!');
            this.instance.setGutterMarker(0,
                'CodeMirror-lint-markers',
                markerMaker());
          } else {
            for (let line = 1; line < lines.length; line += 1) {
              if (lines[line].includes('---')) {
                isValidYAML = true;
                break;
              }
              if (lines[line] === '--') {
                this.instance.setGutterMarker(line,
                    'CodeMirror-lint-markers',
                    markerMaker());
                break;
              }
              if (lines[line] === '-') {
                this.instance.setGutterMarker(line,
                    'CodeMirror-lint-markers',
                    markerMaker());
                break;
              }
            }
            if (isValidYAML) {
              try {
                yamlFront.loadFront(this.state.value);
                mdLintOptions.strings.mdString = this.state.value;
                const mdResult = markdownlint.sync(mdLintOptions);
                if (mdResult.mdString.length === 0) {
                  // Result is correct, no errors
                } else {
                  let errorDetails = '';
                  let errorLine = 0;
                  for (let i = 0; i < mdResult.mdString.length; i += 1) {
                    errorLine = mdResult.mdString[i].lineNumber;
                    errorDetails = `${errorDetails + 'Rule: ' + mdResult.mdString[i].ruleNames[0] + ' => Error: ' + mdResult.mdString[i].ruleDescription + ' => Line: ' + errorLine}\n`; // eslint-disable-line
                    this.instance.setGutterMarker(
                        errorLine - 1,
                        'CodeMirror-lint-markers',
                        markerMaker());
                  }
                  dialog.showErrorBox(
                      'Markdown File is not in a valid format!', `${errorDetails}\nFor more information about Markdown Rules: https://github.com/markdownlint/markdownlint/blob/master/docs/RULES.md`); // eslint-disable-line
                }
              } catch (e) {
                dialog.showErrorBox('Markdown File is not in a valid format!', e.message);
                this.instance.setGutterMarker(e.mark.line,
                    'CodeMirror-lint-markers',
                    markerMaker());
              }
            } else {
              dialog.showErrorBox('YAML front-matter is not in a valid format!', 'MISSING "---" at the end of YAML!');
            }
          }
        }
        if (this.mode !== 'application/json') {
          const results = this.tfLint();
          this.printResultsBox(results);
        }
        console.log(`File ${this.filePath} has been saved.`); // eslint-disable-line
        this.setState({ fileChangedMarker: '' });
        this.setWindowTitle();
      }
    });
  }

  tfLint() {
    const results = new Map();
    const actualText = this.state.value.split('---');
    const wordByWord = actualText[2].split(/\s+/);
    const lineByLine = actualText[2].split(/\n+/);

    // Check if word count is less than 50
    const wordCount = wordByWord.length - 2;
    if (wordCount < 50) {
      results.set('lessThan50Words', true);
    } else results.set('lessThan50Words', false);

    // Check if paragraph count is >1
    let paragraphCount = lineByLine.length - 1;

    // Headers don't count as paragraphs
    for (let i = 0; i < lineByLine.length; i += 1) {
      if (lineByLine[i].startsWith('#')) {
        paragraphCount -= 1;
      }
    }
    if (paragraphCount <= 1) {
      results.set('singleParagraph', true);
    } else results.set('singleParagraph', false);

    // Check if img html uses ui image class
    results.set('badImg', false);
    for (let i = 0; i < lineByLine.length; i += 1) {
      if (lineByLine[i].includes('<img')) {
        if (!lineByLine[i].includes('ui image')) {
          results.set('badImg', true);
        }
      }
    }

    // Check if URL used proper MD format
    results.set('badUrl', false);
    for (let i = 0; i < wordByWord.length; i += 1) {
      if (wordByWord[i].includes('http://') || wordByWord[i].includes('https://')) {
        if (!wordByWord[i].match(/\[.+\]\(https?:\/\/.*\/?\).*/)) {
          results.set('badUrl', true);
        }
      }
    }

    // Check if there is at least one subsection header
    results.set('noSubsection', true);
    for (let i = 0; i < lineByLine.length; i += 1) {
      if (lineByLine[i].startsWith('#')) {
        results.set('noSubsection', false);
      }
    }

    // Check if title contains the word "reflect"
    // const yaml = actualText[1];
    results.set('titleContainsReflect', false);
    const yaml = actualText[1].split(/\n+/);
    if (yaml[2].includes('essay')) {
      if (yaml[3].toUpperCase().includes('reflect'.toUpperCase())) {
        results.set('titleContainsReflect', true);
      }
    }

    console.log(results);
    return results;
  }

  printResultsBox(results) {
    let error = '';
    if (results.get('lessThan50Words') === true) {
      error = error.concat('Word Count is less than 50.\n');
    }
    if (results.get('singleParagraph') === true) {
      error = error.concat('Only a single paragraph.\n');
    }
    if (results.get('badUrl') === true) {
      error = error.concat('Contains a URL not in Markdown format.\n');
    }
    if (results.get('badImg') === true) {
      error = error.concat('Contains an img tag without the responsive ui image class.\n');
    }
    if (results.get('noSubsection') === true) {
      error = error.concat('Does not contain a subsection header.\n');
    }
    if (results.get('titleContainsReflect') === true) {
      error = error.concat('Title contains the string "reflect". Consider something more original!\n');
    }
    if (error !== '') {
      console.log(error);
        dialog.showErrorBox('One or more errors were found in your file.', 'TFLint detects the following errors: \n' + error); // eslint-disable-line
    }
  }

  spellCheck() {
  // Define the new mode
    let numLoaded = 0;
    let affLoading = false;
    let dicLoading = false;
    let affData = '';
    let dicData = '';
    let typo;

    cm.defineMode('spell-check', (config) => {
      // Load AFF/DIC data
      if (!affLoading) {
        affLoading = true;
        const xhrAff = new XMLHttpRequest();
        xhrAff.open('GET', 'https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.aff', true);
        xhrAff.onload = function () {
          if (xhrAff.readyState === 4 && xhrAff.status === 200) {
            affData = xhrAff.responseText;
            numLoaded += 1;
            if (numLoaded === 2) {
              typo = new Typo('en_US', affData, dicData, {
                platform: 'any',
              });
            }
          }
        };
        xhrAff.send(null);
      }
      if (!dicLoading) {
        dicLoading = true;
        const xhrDic = new XMLHttpRequest();
        xhrDic.open('GET', 'https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.dic', true);
        xhrDic.onload = function () {
          if (xhrDic.readyState === 4 && xhrDic.status === 200) {
            dicData = xhrDic.responseText;
            numLoaded += 1;
            if (numLoaded === 2) {
              typo = new Typo('en_US', affData, dicData, {
                platform: 'any',
              });
            }
          }
        };
        xhrDic.send(null);
      }

      // Define what separates a word
      const rxWord = '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ ';

      // Create the overlay and such
      const overlay = {
        token(stream) {
          let ch = stream.peek();
          let word = '';

          if (rxWord.includes(ch)) {
            stream.next();
            return null;
          }

          while ((ch = stream.peek()) != null && !rxWord.includes(ch)) {
            word += ch;
            stream.next();
          }

          if (typo && !typo.check(word)) {
          // console.log(word);
            return 'spell-error'; // CSS class: cm-spell-error
          }

          return null;
        },
      };
      const mode = cm.getMode(
        config, config.backdrop || 'markdown',
      );
      // console.log(mode);
      return cm.overlayMode(mode, overlay, true);
    });
  }

  render() {
    let markdown = this.state.value;
    markdown = markdown.replace(/((.|\n)*)---/gi, '');
    const result = md.render(markdown);
    return (
      <SplitPane
        split="vertical"
        defaultSize={575}
      >
        <div className="pane">
          <CodeMirror
            value={this.state.value}
            onBeforeChange={this.onBeforeChange}
            options={this.options}
            editorDidMount={(editor) => { this.instance = editor; }}
            defineMode={{ name: 'spell-check', fn: this.spellCheck() }}
          />
        </div>
        <div className="pane" dangerouslySetInnerHTML={{ __html: result }} />
      </SplitPane>
    );
  }
}

TechFolioEditor.propTypes = {
  directory: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
