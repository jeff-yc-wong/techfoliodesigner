import React from 'react';
// import techFolioGitHubManager from '../shared/TechFolioGitHubManager';

require('../lib/autorefresh.ext');

const dialog = require('electron').remote.dialog;

export default class ImgEditorOptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      height: '', // could set this to be initial image height
      width: '',  // could set this to be initial image width
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeHeight = this.handleChangeHeight.bind(this);
    this.handleChangeWidth = this.handleChangeWidth.bind(this);
  }

  handleChangeHeight(event) {
    this.setState({
      height: event.target.value,
    });
  }


  handleChangeWidth(event) {
    this.setState({
      width: event.target.value,
    });
  }


  handleSubmit(event) {
    dialog.showErrorBox('Error', `A value was submitted: ${this.state.width} x ${this.state.height}`);
    event.preventDefault();
  }

// htmlFor is because there'd be an ESLint error without it.
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor={this.state.width}>
          Crop:
          <input type="text" name="width" onChange={this.handleChangeWidth} value={this.state.width} />
        </label>
        <br />
        <label htmlFor={this.state.width}>
          Height
          <input type="text" name="height" onChange={this.handleChangeHeight} value={this.state.height} />
        </label>
        <br />
        <input type="submit" value="Crop" />
      </form>
    );
  }
}
