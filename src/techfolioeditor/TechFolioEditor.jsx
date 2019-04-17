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
const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
});
// const Jimp = require('jimp');
const sizeOf = require('image-size');

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
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["spellCheck", "printResultsBox"] }] */
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
    this.cm = cm;
    this.codeMirrorRef = null;
    this.filePath = path.join(this.props.directory, this.props.fileType, this.props.fileName);
    this.state = {
      value: fs.existsSync(this.filePath) ? fs.readFileSync(this.filePath, 'utf8') : `no ${this.filePath}`,
      fileChangedMarker: '',
      previewMode: false,
      word: getSelection(), //eslint-disable-line
    };
    const fileExtension = this.props.fileName.match(/\.(.*)/gi);
    switch (fileExtension[0]) {
      case '.md':
        this.mode = 'spell-check';
        break;
      case '.json':
        this.mode = 'application/json';
        break;
      case '.yaml':
      case '.yml':
        this.mode = 'text/x-yaml';
        break;
      default:
        this.mode = 'text/plain';
    }
    const extraKeys = {};
    const saveKeyBinding = (process.platform === 'darwin') ? 'Cmd-S' : 'Ctrl-S';
    const lintKeyBinding = (process.platform === 'darwin') ? 'Cmd-L' : 'Ctrl-L';
    const addToDictionaryKeyBinding = (process.platform === 'darwin') ? 'Cmd-D' : 'Ctrl-D';
    extraKeys[saveKeyBinding] = () => this.saveFile();
    extraKeys[lintKeyBinding] = () => this.callTfLint(false);
    extraKeys[addToDictionaryKeyBinding] = () => this.addToDictionary(this.state.word);
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
    this.setState(({
      previewMode: !this.state.previewMode,
    }));
  }

  /**
   * Saves the current file that is open, calling various lints to check if the file is formatted correctly.
   */
  saveFile() {
    // console.log('saveFile called'); //eslint-disable-line
    // console.log(this.filePath);
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
                const actualText = this.state.value.split('---');
                mdLintOptions.strings.mdString = actualText[2];
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
        this.callTfLint(true);
        console.log(`File ${this.filePath} has been saved.`); // eslint-disable-line
        this.setState({ fileChangedMarker: '' });
        this.setWindowTitle();
      }
    });
  }

  /**
   * Helper function to call tfLint or tfBioLint depending on if the file is a project/essay, or bio.json, respectively.
   * @param calledBySave Let the function know to change the results printing based on how tfLint was called
   */
  callTfLint(calledBySave) {
    let results = new Map();
    let isBio = false;
    if (this.mode !== 'application/json') {
      results = this.tfLint();
    } else {
      results = this.tfBioLint();
      isBio = true;
    }
    this.printResultsBox(results, calledBySave, isBio);
  }

  /**
   * Basic tfLint for projects/essays. Checks a variety of factors throughout the file to ensure high quality write-ups.
   * @returns {Map} Returns a results mapping that is used to print the results box.
   */
  tfLint() {
    const results = new Map();
    const actualText = this.state.value.split('---');
    const wordByWord = actualText[2].split(/\s+/);
    const lineByLine = actualText[2].split(/\n+/);
    const yaml = actualText[1].split(/\n+/);

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

    // Check img html
    // Check if img html uses ui image class
    // Sets badImg value to line numbers of errors over true/false
    let lineNumberImageUi = '';
    let lineNumberImagePx = '';
    let lineNumberImageSize = '';
    for (let i = 0; i < lineByLine.length; i += 1) {
      if (lineByLine[i].includes('<img')) {
        if (!lineByLine[i].includes('ui image')) {
          lineNumberImageUi = lineNumberImageUi.concat(` ${(i + yaml.length).toString()}`);
        }
        // Check image size and other stuff
        // Isolate image path and join it to base directory to get total image path
        let imagePath = lineByLine[i].match(/<img.*>/).input;
        imagePath = imagePath.match(/src=".*images.*"/)[0];
        imagePath = imagePath.split('"');
        imagePath = imagePath[1];
        imagePath = imagePath.substring(2);
        imagePath = path.join(this.props.directory, imagePath);
        // console.log(imagePath);

        // todo Can I extract image properties from the function
          // todo Use different+simpler npm package probably might be easier
        // Use Jimp to open image and pull data from it using given path
        // Jimp.read(imagePath, (err, image) => {
        //   if (err) throw err;
        //   // console.log(image.bitmap.height);
        //   // console.log(image.bitmap.width);
        //
        //   if (image.bitmap.height < 200 && image.bitmap.width < 200) {
        //     lineNumberImagePx = lineNumberImagePx.concat(` ${(i + yaml.length).toString()}`);
        //   }
        // });

        const imageDimensions = sizeOf(imagePath);
        // console.log(imageDimensions);

        if (imageDimensions.height < 200 && imageDimensions.width < 200) {
          lineNumberImagePx = lineNumberImagePx.concat(` ${(i + yaml.length).toString()}`);
          console.log(lineNumberImagePx);
        }

        const imageStats = fs.statSync(imagePath);
        if (imageStats.size > 500000) {
          lineNumberImageSize = lineNumberImageSize.concat(` ${(i + yaml.length).toString()}`);
        }
      }
    }
    results.set('badImgUi', lineNumberImageUi);
    results.set('badImgPx', lineNumberImagePx);
    results.set('badImgSize', lineNumberImageSize);

    // Check if URL used proper MD format
    // Sets badUrl value to line numbers of errors over true/false
    let lineNumberUrl = '';
    for (let i = 0; i < lineByLine.length; i += 1) {
      if (lineByLine[i].includes('http://') || lineByLine[i].includes('https://')) {
        if (!lineByLine[i].match(/.*\[.+]\(https?:\/\/.*\/?\).*/)) {
          lineNumberUrl = lineNumberUrl.concat(` ${(i + yaml.length).toString()}`);
        }
      }
    }
    results.set('badUrl', lineNumberUrl);

    // Check if there is at least one subsection header
    results.set('noSubsection', true);
    for (let i = 0; i < lineByLine.length; i += 1) {
      if (lineByLine[i].startsWith('#')) {
        results.set('noSubsection', false);
      }
    }

    results.set('titleContainsReflect', false);
    results.set('titleMissingQuotes', true);
    results.set('dateNotProperFormat', true);
    let type = '';
    for (let i = 1; i < yaml.length - 1; i += 1) {
      // Check type (essay or project)
      if (yaml[i].includes('type:') && yaml[i].includes('essay')) {
        type = 'essay';
      } else {
        type = 'project';
      }

        // Check if title contains the word "reflect"
      if (type === 'essay' && yaml[i].includes('title:') && yaml[i].toUpperCase().includes('reflect'.toUpperCase())) {
        results.set('titleContainsReflect', true);
      }

      // Check if project image is square
      if (type === 'project' && yaml[i].includes('image:')) {
        // Get image path
        let imagePath = yaml[i];
        imagePath = imagePath.split(' ');
        imagePath = imagePath[1];
        imagePath = `/${imagePath}`;
        imagePath = path.join(this.props.directory, imagePath);

        const imageDimensions = sizeOf(imagePath);

        if (imageDimensions.height !== imageDimensions.width) {
          results.set('imageNotSquare', true);
        }
      }

      // Check if title is surrounded by quotes
      if (yaml[i].includes('title')) {
        if (yaml[i].match(/title: ".*"/)) {
          results.set('titleMissingQuotes', false);
          // console.log('titleQuotes');
        }
      }
      // Check if date is YYYY-MM-DD format
      if (yaml[i].includes('date:')) {
        if (yaml[i].match(/date: \d{4}-\d{2}-\d{2}/)) {
          results.set('dateNotProperFormat', false);
        }
      }
    }
    return results;
  }

  /**
   * The version of tfLint that checks the bio.json for any errors.
   * @returns {Map} Returns a results mapping that is used to print the results box.
   */
  tfBioLint() {
    const results = new Map();
    let missingSectionResults = '';
    let bio;

    try {
      bio = JSON.parse(this.state.value);
    } catch (e) {
      dialog.showErrorBox('JSON File is not in a valid format!', 'There is at least one JSON error!');
    }

    results.set('profileNotSquare', false);
    // console.log(bio);

    const img = new Image(); // eslint-disable-line
    img.src = bio.basics.picture;
    img.onload = function () {
      if (this.width !== this.height) results.get('profileNotSquare', true);
    };

    for (const key in bio) {  // eslint-disable-line
      console.log(bio[key]);
      for (const subKey in bio[key]) {  // eslint-disable-line
        console.log(bio[key][subKey]);
        if (this.isEmpty(bio[key][subKey])) {
          missingSectionResults = missingSectionResults.concat(`${subKey} `);
        }
      }
    }
    results.set('missingInformation', missingSectionResults);

    return results;
  }

  /**
   * Prints the results from tfLint in a dialog box.
   * @param results  Results mapping from tfLint.
   * @param calledBySave  Whether the initial call to tfLint was made by saving or not determines the text.
   * @param isBio  Whether the initial call was on a bio.json or not determines how to check the results for printing.
   */
  printResultsBox(results, calledBySave, isBio) { // eslint-disable-line class-methods-use-this
    let error = '';
    let errorCount = 0;
    let calledMessage = '\nIt is in your best interest to correct these errors.';
    console.log(results);
    if (isBio) {
      if (results.get('profileNotSquare') === true) {
        error = error.concat(`${errorCount + 1}. Profile image is not square.\n`);
        errorCount += 1;
      }
      if (results.get('missingInformation') !== '') {
        error = error.concat(`${errorCount + 1}. These sections of your bio have not been filled out: 
        ${results.get('missingInformation')}\n`);
        errorCount += 1;
      }
    } else {
      if (results.get('lessThan50Words') === true) {
        error = error.concat(`${errorCount + 1}. Word Count is less than 50.\n`);
        errorCount += 1;
      }
      if (results.get('singleParagraph') === true) {
        error = error.concat(`${errorCount + 1}. Only a single paragraph.\n`);
        errorCount += 1;
      }
      if (results.get('badUrl') !== '') {
            error = error.concat((errorCount + 1) + '. Contains a URL not in Markdown format. ' + // eslint-disable-line
                'Error occurs on line(s)' + results.get('badUrl') + '.\n');
        errorCount += 1;
      }
      if (results.get('badImgUi') !== '') {
            error = error.concat((errorCount + 1) + '. Contains an img tag without the responsive ui image class. ' + // eslint-disable-line
                'Error occurs on line(s)' + results.get('badImgUi') + '.\n');
        errorCount += 1;
      }
      if (results.get('badImgPx') !== '') {
            error = error.concat((errorCount + 1) + '. Contains an image that is smaller than 200 x 200 px. ' + // eslint-disable-line
                'Error occurs on line(s)' + results.get('badImgPx') + '.\n');
        errorCount += 1;
      }
      if (results.get('badImgSize') !== '') {
            error = error.concat((errorCount + 1) + '. Contains an image that is larger than 500kb. ' + // eslint-disable-line
                'Error occurs on line(s)' + results.get('badImgSize') + '.\n');
        errorCount += 1;
      }
      if (results.get('imageNotSquare') === true) {
        error = error.concat(`${errorCount + 1}. Project image is not square.\n`);
        errorCount += 1;
      }
      if (results.get('noSubsection') === true) {
        error = error.concat(`${errorCount + 1}. Does not contain a subsection header.\n`);
        errorCount += 1;
      }
      if (results.get('titleContainsReflect') === true) {
            error = error.concat(`${errorCount + 1}. Title contains the string "reflect". Consider something more original!\n`); // eslint-disable-line
        errorCount += 1;
      }
      if (results.get('titleMissingQuotes') === true) {
        error = error.concat(`${errorCount + 1}. Title is missing quotes around it.\n`);
        errorCount += 1;
      }
      if (results.get('dateNotProperFormat') === true) {
        error = error.concat(`${errorCount + 1}. Date is not in YYYY-MM-DD format.\n`);
        errorCount += 1;
      }
    }
    if (calledBySave) {
      calledMessage = '\nYour file has been saved anyway, but it is in your best interest to correct these errors.';
    }
    if (error !== '') {
      console.log(results);
      dialog.showErrorBox('TFLint Results',
            errorCount + ' errors were found in your file.\nTFLint detects the following errors: \n\n' // eslint-disable-line
          + error + calledMessage + ' These errors may interfere with Techfolio Designer\'s preview mode or the quality of your writeup.'); // eslint-disable-line
    } else {
      dialog.showMessageBox({ type: 'info', title: 'TFLint Results', message: 'No errors were found in your file.' });
    }
  }

  /**
   * Helper method to check if an object given is empty (i.e. has no value).
   * @param Object  Object to check for emptiness
   * @returns {boolean}  Returns true if empty, false otherwise.
   */
  isEmpty(Object) {  // eslint-disable-line
    for (const key in Object) {  // eslint-disable-line
      if (Object.hasOwnProperty(key)) return false;  // eslint-disable-line
    }
    return true;
  }

  spellCheck() {
    // Define the new mode
    let numLoaded = 0;
    let affLoading = false;
    let dicLoading = false;
    let affData = '';
    let dicData = '';
    let typo;

    this.cm.defineMode('spell-check', (config) => {
      // Load AFF/DIC data
      if (!affLoading) {
        affLoading = true;
        // eslint-disable-next-line no-undef
        const xhrAff = new XMLHttpRequest();
        xhrAff.open('GET', 'https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.aff', true);
        xhrAff.onload = () => {
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
        // eslint-disable-next-line no-undef
        const xhrDic = new XMLHttpRequest();
        xhrDic.open('GET', 'https://cdn.jsdelivr.net/codemirror.spell-checker/latest/en_US.dic', true);
        xhrDic.onload = () => {
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
      const rxWord = '\'!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ ';

      // Create the overlay and such
      const overlay = {
        token(stream) {
          let ch = stream.peek();
          let word = '';

          if (rxWord.includes(ch)) {
            stream.next();
            return null;
          }

          // eslint-disable-next-line no-cond-assign
          while ((ch = stream.peek()) != null && !rxWord.includes(ch)) { // eslint-disable-line
            word += ch;
            stream.next();
          }

          // const value = parseInt(word, 10);
          // if (!isNaN(value)) {
          //   return null;
          // }

          if (word.match(/\d+\w*/g) !== null || word.match(/\w*\d+/g) !== null) {
            return null;
          }

          let dictionary = '';
          try {
            dictionary = fs.readFileSync('../techfoliodesigner/src/techfolioeditor/dictionaryAdditions', 'utf-8');
          } catch (err) {
            console.log('No dictionary exists.');
            fs.writeFileSync('../techfoliodesigner/src/techfolioeditor/dictionaryAdditions', '');
          }
          const dictionaryArray = dictionary.split('\n');

          for (let i = 0; i < dictionaryArray.length; i += 1) {
            if (dictionaryArray[i] === word) {
              return null;
            }
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

  addToDictionary(word) {
    if (confirm(`Do you want to add ${word} to the dictionary?`)) { //eslint-disable-line
      console.log(`Adding ${word}`);
      let dictionary = '';
      try {
        dictionary = fs.readFileSync('../techfoliodesigner/src/techfolioeditor/dictionaryAdditions', 'utf-8');
      } catch (err) {
        console.log('No Dictionary exists to add to');
      }
      dictionary = dictionary.concat(`${word}\n`);
      fs.writeFileSync('../techfoliodesigner/src/techfolioeditor/dictionaryAdditions', dictionary);
    }
  }

  render() {
    // preview conditionally rendered
    const fileExtension = this.props.fileName.match(/\.(.*)/gi);
    if (fileExtension[0] !== '.md') {
      return (
        <div>
          <CodeMirror
            value={this.state.value}
            onBeforeChange={this.onBeforeChange}
            options={this.options}
            editorDidMount={(editor) => { this.instance = editor; }}
          />
        </div>);
    }

    let editorJSX;
    // preview conditionally rendered
    if (this.state.previewMode) {
      const codeMirrorWidth = this.codeMirrorDiv.offsetWidth / 2;
      let markdown = this.state.value;
      if (markdown.match(/---((.|\n)*?)---\n/gi) === null) {
        dialog.showErrorBox('Preview Error', 'There is nothing to preview!');
        editorJSX = (
          <div
            className="editor"
            ref={(div) => { this.codeMirrorDiv = div; }}
          >
            <CodeMirror
              value={this.state.value}
              onBeforeChange={this.onBeforeChange}
              options={this.options}
              editorDidMount={(editor) => { this.instance = editor; }}
              defineMode={{ name: 'spell-check', fn: this.spellCheck() }}
            />
          </div>);
      } else {
        const yaml = markdown.match(/---((.|\n)*?)---\n/gi)[0];
        markdown = markdown.replace(/---((.|\n)*?)---\n/gi, '');
        // date and title header
        let title = yaml.match(/title:[^\n]*/g)[0];
        title = title.replace('title: ', '');
        let date = yaml.match(/date:[^\n]*/g)[0];
        date = date.replace('date: ', '');

        let finalResult = `<h1>${title}</h1><span>${date}</span><hr>`;

        const absPath = this.filePath.replace(/github\.io\/.*/, 'github.io');
        markdown = markdown.replace(/src="\.\./gi, `src="${absPath}`);
        markdown = md.render(markdown);
        finalResult = finalResult.concat(markdown);

        editorJSX = (<SplitPane
          split="vertical"
          defaultSize={codeMirrorWidth}
        >
          <div
            className="editor"
            ref={(div) => {
              this.codeMirrorDiv = div;
            }}
          >
            <CodeMirror
              value={this.state.value}
              onBeforeChange={this.onBeforeChange}
              options={this.options}
              editorDidMount={(editor) => {
                this.instance = editor;
              }}
              defineMode={{ name: 'spell-check', fn: this.spellCheck() }}
            />
          </div>
          <div className="scroll">
            <div className="preview" dangerouslySetInnerHTML={{ __html: finalResult }} />
          </div>
        </SplitPane>);
      }
    } else {
      editorJSX = (
        <div
          className="editor"
          ref={(div) => { this.codeMirrorDiv = div; }}
        >
          <CodeMirror
            value={this.state.value}
            onBeforeChange={this.onBeforeChange}
            options={this.options}
            editorDidMount={(editor) => { this.instance = editor; }}
            defineMode={{ name: 'spell-check', fn: this.spellCheck() }}
          />
        </div>);
    }
    return (
      <div>
        <label
          htmlFor="previewMode"
          className="switch fixed-button"
          onChange={this.handleClick}
        >
          <div className="wrapper">
            <input type="checkbox" id="previewMode" />
            <span className="hover slider round" />
            <p className="text">Preview Mode</p>
          </div>
        </label>
        {editorJSX}
      </div>
    );
  }
}

TechFolioEditor.propTypes = {
  directory: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
