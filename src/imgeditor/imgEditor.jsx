import React from 'react';
import PropTypes from 'prop-types';
import path from 'path';

const fs = require('fs');

require('../lib/autorefresh.ext');

export default class imgEditor extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.fileName);
    // this.onBeforeChange = this.onBeforeChange.bind(this);
    // this.setWindowTitle = this.setWindowTitle.bind(this);
    // // this.copy = this.copy.bind(this);
    // // this.paste = this.paste.bind(this);
    // this.window = require('electron').remote.getCurrentWindow(); //eslint-disable-line
    // this.window.setTitle(this.props.fileName);
  }

  render() {
    return (
        <imgEditor></imgEditor>
    );
  }
}

imgEditor.propTypes = {
  directory: PropTypes.string.isRequired,
  fileType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
