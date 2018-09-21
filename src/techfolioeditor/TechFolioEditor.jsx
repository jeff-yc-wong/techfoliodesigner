import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';
// import fs from 'fs-extra';
import { Controlled as CodeMirror } from 'react-codemirror2';
import cm from 'codemirror';
import SimpleMDE from 'react-simplemde-editor';
import jsonlint from 'jsonlint';
import { JSHINT } from 'jshint';

const Typo = require('typo-js');
const fs = require('fs');
const notifier = require('node-notifier');
const yamlFront = require('yaml-front-matter');
const markdownlint = require('markdownlint');

const mdLintOptions = {
  'strings': { // eslint-disable-line
    'mdString': '', // eslint-disable-line
  },
};

function markerMaker(message) {
  // {/*<div className="ui icon button" data-content="Add users to your feed">*/}
  //   {/*<i className="add icon"></i>*/}
  // {/*</div>*/}
  let markerElt = document.createElement('div'); // eslint-disable-line
  let markerError = document.createElement('div'); // eslint-disable-line
  let markerMessage = document.createTextNode(message); // eslint-disable-line

  markerElt.className = 'CodeMirror-gutter-elt';
  markerError.className = 'CodeMirror-lint-marker-error';
  markerElt.appendChild(markerError);
  // markerError.appendChild(markerMessage);
  console.log(message);
  return markerElt;
}

require('codemirror/lib/codemirror.js');
require('codemirror/mode/css/css.js');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
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

  saveFile() {
    console.log('saveFile called'); //eslint-disable-line
    let notifierTitle = '';
    let notifierMessage = '';

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
          this.instance.clearGutter('CodeMirror-lint-markers');
          let isValidYAML = false;
          const lines = this.state.value.split('\n');
          if (lines[0] !== '---') {
            this.instance.setGutterMarker(0,
                'CodeMirror-lint-markers',
                markerMaker('MISSING "---" on the first line!'));
          } else {
            for (let line = 1; line < lines.length; line += 1) {
              if (lines[line].includes('---')) {
                isValidYAML = true;
                break;
              }
              if (lines[line] === '--') {
                this.instance.setGutterMarker(line,
                    'CodeMirror-lint-markers',
                    markerMaker('MISSING "---" on the first line!'));
                break;
              }
              if (lines[line] === '-') {
                this.instance.setGutterMarker(line,
                    'CodeMirror-lint-markers',
                    markerMaker('MISSING "---" on the first line!'));
                break;
              }
            }
            if (isValidYAML) {
              try {
                yamlFront.loadFront(this.state.value);
                mdLintOptions.strings.mdString = this.state.value;
                const mdResult = markdownlint.sync(mdLintOptions);
                if (mdResult.mdString.length === 0) {
                  console.log('NO ERRORS');
                } else {
                  for (let i = 0; i < mdResult.mdString.length; i += 1) {
                    this.instance.setGutterMarker(
                        mdResult.mdString[i].lineNumber - 1,
                        'CodeMirror-lint-markers',
                        markerMaker(mdResult.mdString[i].errorDetail));
                  }
                }
              } catch (e) {
                this.instance.setGutterMarker(e.mark.line,
                    'CodeMirror-lint-markers',
                    markerMaker(e.message));
              }
            } else {
              notifierTitle = 'YAML FRONT-MATTER ERROR';
              notifierMessage = 'MISSING "---" at the end of YAML';
            }
          }
        }
        notifier.notify({
          title: notifierTitle,
          message: notifierMessage,
        });
        console.log(`File ${this.filePath} has been saved.`); // eslint-disable-line
        this.setState({ fileChangedMarker: '' });
        this.setWindowTitle();
      }
    });
  }

  spellCheck() {
  	// Define the new mode
    let num_loaded = 0;
    let aff_loading = false;
    let dic_loading = false;
    let aff_data = "";
    let dic_data = "";
    let typo;

  	cm.defineMode("spell-check", function(config) {
  		// Load AFF/DIC data
  		if(!aff_loading) {
  			aff_loading = true;
  			var xhr_aff = new XMLHttpRequest();
  			xhr_aff.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.aff", true);
  			xhr_aff.onload = function() {
  				if(xhr_aff.readyState === 4 && xhr_aff.status === 200) {
  					aff_data = xhr_aff.responseText;
  					num_loaded++;

  					if(num_loaded == 2) {
  						typo = new Typo("en_US", aff_data, dic_data, {
  							platform: "any"
  						});
  					}
  				}
  			};
  			xhr_aff.send(null);
  		}

  		if(!dic_loading) {
  			dic_loading = true;
  			var xhr_dic = new XMLHttpRequest();
  			xhr_dic.open("GET", "https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.dic", true);
  			xhr_dic.onload = function() {
  				if(xhr_dic.readyState === 4 && xhr_dic.status === 200) {
  					dic_data = xhr_dic.responseText;
  					num_loaded++;

  					if(num_loaded == 2) {
  						typo = new Typo("en_US", aff_data, dic_data, {
  							platform: "any"
  						});
  					}
  				}
  			};
  			xhr_dic.send(null);
  		}

      // Define what separates a word
      var rx_word = "!\"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ ";


      // Create the overlay and such
      var overlay = {
        token: function(stream) {
          var ch = stream.peek();
          var word = "";

          if(rx_word.includes(ch)) {
            stream.next();
            return null;
          }

          while((ch = stream.peek()) != null && !rx_word.includes(ch)) {
            word += ch;
            stream.next();
          }

          if(typo && !typo.check(word)) {
            console.log(word);
            return "spell-error"; // CSS class: cm-spell-error
          }

          return null;
        }
      };

      var mode = cm.getMode(
        config, config.backdrop || 'markdown'
      );
      //console.log(mode);
      return cm.overlayMode(mode, overlay, true);
  	});
  }

  render() {
    switch (this.mode) {
      case 'markdown':
        return (
          <div>
            <SimpleMDE
              onChange={this.handleChange}
              value={this.state.value}
              onBeforeChange={this.onBeforeChange}
              options={this.options}
              editorDidMount={(editor) => {
                this.instance = editor;
              }}
            />
          </div>
        );
      default:
        return (
          <div>
            <CodeMirror
              value={this.state.value}
              onBeforeChange={this.onBeforeChange}
              options={this.options}
              editorDidMount={(editor) => {
                this.instance = editor;
              }}
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
