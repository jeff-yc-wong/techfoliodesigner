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
      previewMode: false,
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

    this.handleClick = this.handleClick.bind(this);
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

  handleClick() {
    this.setState(state => ({
      previewMode: !this.state.previewMode
    }));
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
        console.log(`File ${this.filePath} has been saved.`); // eslint-disable-line
        this.setState({ fileChangedMarker: '' });
        this.setWindowTitle();
      }
    });
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
    //preview conditionally rendered

    if(this.state.previewMode){

      let markdown = this.state.value;
      let yaml = markdown.match(/---((.|\n)*?)---\n/gi)[0];
      markdown = markdown.replace(/---((.|\n)*?)---\n/gi,'');

      //date and title header
      let title = yaml.match(/title:[^\n]*/g)[0];
      title = title.replace('title: ', '');
      let date = yaml.match(/date:[^\n]*/g)[0];
      date = date.replace('date: ', '');

      let finalResult = '<h1>'+title+'</h1>'+'<span>'+date+'</span>'+'<hr>';

      let snippets = markdown.match(/(.|\n)*?<img[^>]*>/gi);
      markdown = markdown.replace(/(.|\n)*<img[^>]*>/gi,'');

      for(var i = 0; i < snippets.length; i++) {
        let img = snippets[i].match(/<img[^>]*>/gi);

        //img tag removed from snippet
        snippets[i] = snippets[i].replace(img, '');

        let absPath = this.filePath.replace(/github\.io\/.*/, 'github.io');
        img = img[0].replace('..', absPath);

        //snippet rendered into md
        snippets[i] = md.render(snippets[i]);
        finalResult = finalResult.concat(snippets[i], img);
      }
      //last snippet
      markdown = md.render(markdown);
      finalResult = finalResult.concat(markdown);

      return (
        <SplitPane split="vertical"
                   defaultSize={575}>
          <div className="editor">
            <button onClick={this.handleClick}>
              Preview
            </button>
            <CodeMirror
              value={this.state.value}
              onBeforeChange={this.onBeforeChange}
              options={this.options}
              editorDidMount={(editor) => { this.instance = editor; }}
              defineMode={{ name: 'spell-check', fn: this.spellCheck() }}
            />
          </div>
          <div className="scroll">
            <div className="preview" dangerouslySetInnerHTML={{__html: finalResult}}>
            </div>
          </div>
        </SplitPane>
      );
    } else {
      return (
          <div className="editor">
            <button onClick={this.handleClick}>
              Preview
            </button>
            <CodeMirror
              value={this.state.value}
              onBeforeChange={this.onBeforeChange}
              options={this.options}
              editorDidMount={(editor) => { this.instance = editor; }}
              defineMode={{ name: 'spell-check', fn: this.spellCheck() }}
            />
          </div>
      );
    }
  }
}

TechFolioEditor.propTypes = {
  directory: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
