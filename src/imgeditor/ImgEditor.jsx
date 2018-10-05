import React from 'react';
import { Container, Input, Grid, Divider, Header, Icon } from 'semantic-ui-react';
import techFolioGitHubManager from '../shared/TechFolioGitHubManager';

require('../lib/autorefresh.ext');

const dialog = require('electron').remote.dialog;
const fs = require('fs');
const sizeOf = require('image-size');

export default class ImgEditor extends React.Component {

  constructor(props) {
    super(props);
    // this.window = require('electron').remote.getCurrentWindow(); //eslint-disable-line
    this.state = {
      image: {
        path: '',
        border: '',
        display: '',
        backgroundColor: 'lightgrey',
      },
      properties: {
        imageName: '',
        imageType: '',
        imageHeight: '',
        imageWidth: '',
        imageSize: '',
      },
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
        // dialog.showErrorBox('Error', 'No image selected.');
      } else {
        const dimensions = sizeOf(fullPath.toString());
        let imgName = fullPath.toString().split('/');
        imgName = imgName[imgName.length - 1];
        this.setState({
          image: {
            path: fullPath,
            border: 'solid black 1px',
            display: 'none',
            backgroundColor: 'white',
          },
          properties: {
            imageName: imgName,
            imageType: imgName.split('.')[1],
            imageHeight: dimensions.height,
            imageWidth: dimensions.width,
            imageSize: fs.statSync(fullPath.toString()).size / 1000,
          },
        });
      }
    });
  }

  render() {
    return (
      <Container fluid style={{ padding: '2%', minHeight: '100%' }}>
        <Grid>
          <Grid.Column width={12}>
            <Grid.Row>
              <Grid.Column>
                <div
                  role="button"
                  tabIndex="0"
                  onClick={this.selectImage}
                  style={{ backgroundColor: this.state.image.backgroundColor, textAlign: 'center' }}
                >
                  <div>
                    <div style={{ paddingTop: '5%', display: this.state.image.display }}>
                      <Header as="h2" icon>
                        <Icon name="crop" />
                        Edit an Image
                        <Header.Subheader>Manage your image for your Techfolio!</Header.Subheader>
                      </Header>
                    </div>
                    <img
                      src={this.state.image.path}
                      alt={''}
                      style={{
                        maxHeight: '500px',
                        maxWidth: '100%',
                        textAlign: 'center',
                        border: this.state.image.border,
                      }}
                    />
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Divider />
              <Grid.Column>
                <Header as="h1">Properties:</Header>
                <p>Image Name: {this.state.properties.imageName}</p>
                <p>Image Type: {this.state.properties.imageType}</p>
                <p>Image Height: {this.state.properties.imageHeight}</p>
                <p>Image Width: {this.state.properties.imageWidth}</p>
                <p>Image Size: {this.state.properties.imageSize} KB</p>
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={4} style={{ overflow: 'scroll', height: '97vh' }}>
            <Grid.Row>
              <Grid.Column>
                <Header as="h1">Edit Image:</Header>
                <Header as="h3">Height:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Height" />
                <Header as="h3">Width:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Width" />
                <Header as="h3">Blit:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Height" />
                <Header as="h3">Blur:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Width" />
                <Header as="h3">Color:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Height" />
                <Header as="h3">Contain:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Width" />
                <Header as="h3">Cover:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Height" />
                <Header as="h3">Displace:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Width" />
                <Header as="h3">Dither:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Height" />
                <Header as="h3">Flip:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Width" />
                <Header as="h3">Gaussian:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Height" />
                <Header as="h3">Invert:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Width" />
                <Header as="h3">Mask:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Height" />
                <Header as="h3">Print:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Width" />
                <Header as="h3">Rotate:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Width" />
                <Header as="h3">Scale:</Header>
                <Input label={{ basic: true, content: 'px' }} labelPosition="right" placeholder="Width" />
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

//
// <div>
//  <div role="button" tabIndex="0" onClick={this.selectImage} style={{ width: '50vw', height: '70vh' }}>
//    <div style={{ textAlign: 'center' }}>
//      <img
//          src={this.state.image}
//          alt="Click Here to Select File"
//          style={{ width: '100%', textAlign: 'center' }}
//      />
//    </div>
//  </div>
//   <div>
//     <h1>Properties:</h1>
//     <p>Image Name: {this.state.properties.imageName}</p>
//     <p>Image Type: {this.state.properties.imageType}</p>
//     <p>Image Height: {this.state.properties.imageHeight}</p>
//     <p>Image Width: {this.state.properties.imageWidth}</p>
//     <p>Image Size: {this.state.properties.imageSize} KB</p>
//   </div>
// </div>
/*
<form onSubmit={this.handleSubmit}>
  <label>
    Crop:
    <input type="text" name="width" onChange={this.handleChange} value={this.state.properties.imageWidth} />
  </label>
  <br />
  <label>
    Height
    <input type="text" name="height" onChange={this.handleChange} value={this.state.properties.imageHeight} />
  </label>
  <br />
  <input onClick={this.handleCrop} value="Crop" />
</form>
*/
