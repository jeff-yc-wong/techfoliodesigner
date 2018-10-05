import React from 'react';
import techFolioGitHubManager from '../shared/TechFolioGitHubManager';

require('../lib/autorefresh.ext');

const dialog = require('electron').remote.dialog;

export default class ImgEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      image: '#',
    };
    this.selectImage = this.selectImage.bind(this);
  }

  selectImage() {
    dialog.showOpenDialog({
      title: 'Select an image',
      properties: ['openFile'],
      defaultPath: techFolioGitHubManager.getSavedState().dir.concat('/images/'),
      buttonLabel: 'Crop',
    }, (fullPath) => {
      if (fullPath === undefined) {
        dialog.showErrorBox('Error', 'No image selected.');
      } else {
        this.setState({ image: fullPath[0] });
      }
    });
  }

  render() {
    return (
      <div role="button" tabIndex="0" onClick={this.selectImage} style={{ width: '50vw', height: '70vh' }}>
        <div style={{ textAlign: 'center' }}>
        <img src={this.state.image} alt="Click Here to Select File" style={{ width: '100%', textAlign: 'center' }} />
        </div>
      </div>
    );
  }
}
