
import React from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import { Container, Label, Divider, Header, Icon, Button, Checkbox } from 'semantic-ui-react';
import techFolioGitHubManager from '../shared/TechFolioGitHubManager';


require('../lib/autorefresh.ext');


const dialog = require('electron').remote.dialog;
const fs = require('fs');
const sizeOf = require('image-size');
const Jimp = require('jimp');

export default class ImgEditor extends React.Component {
  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["onImageLoaded", "onCropComplete"] }] */

  constructor(props) {
    super(props);
    this.state = {
      aspect: false,
      src: null,
      image: {
        path: [''],
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
      crop: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        aspect: 0,
      },
    };

    this.selectImage = this.selectImage.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.onCropChange = this.onCropChange.bind(this);
    this.saveCrop = this.saveCrop.bind(this);
    this.toggleAspectRatio = this.toggleAspectRatio.bind(this);
  }

  onImageLoaded() {
    // console.log('Loaded Image', image);
  }

  onCropComplete() {
    // console.log('Crop Completed', crop);
  }

  onCropChange(crop) {
    this.setState({ crop });
  }

  saveCrop() {
    let fullPath = '';
    let imagePath = this.state.image.path.split('/');
    imagePath.splice(-1, 1);
    imagePath = imagePath.join('/');
    Jimp.read(this.state.image.path, (err, image) => {
      if (err) throw err;
      if (!(this.state.properties.imageName.includes('_cropped'))) {
        fullPath = `${imagePath}/${this.state.properties.imageName}_cropped.png`;
      } else {
        fullPath = `${imagePath}/${this.state.properties.imageName}.png`;
      }
      image.crop(
          ((this.state.crop.x / 100) * this.state.properties.imageWidth),
          ((this.state.crop.y / 100) * this.state.properties.imageHeight),
          ((this.state.crop.width / 100) * this.state.properties.imageWidth),
          ((this.state.crop.height / 100) * this.state.properties.imageHeight),
      ).write(fullPath);
      this.updateCrop(image, fullPath);
    });
    const options = {
      type: 'info',
      title: 'Image has been cropped',
      message: 'The image has been successfully cropped.',
      buttons: ['Okay'],
    };
    dialog.showMessageBox(options);
  }

  updateCrop(cropImage, cropPath) {
    console.log(cropImage);
    console.log(cropPath);
    if (cropPath !== undefined) {
      let imgName = cropPath.split('/');
      imgName = imgName[imgName.length - 1];
      this.setState({
        src: cropPath,
        image: {
          path: cropPath,
          border: 'solid black 1px',
          display: 'none',
          backgroundColor: 'white',
        },
        properties: {
          imageName: imgName.split('.')[0],
          imageType: imgName.split('.')[1],
          imageHeight: cropImage.bitmap.height,
          imageWidth: cropImage.bitmap.width,
          imageSize: fs.statSync(cropPath).size / 1000,
        },
        crop: {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        },
      });
    }
  }

  selectImage() {
    dialog.showOpenDialog({
      title: 'Select an image',
      properties: ['openFile'],
      defaultPath: techFolioGitHubManager.getSavedState().dir.concat('/images/'),
      buttonLabel: 'Crop',
    }, (fullPath) => {
      if (fullPath !== undefined) {
        console.log(fullPath);
        const dimensions = sizeOf(fullPath.toString());
        let imgName = fullPath.toString().split('/');
        imgName = imgName[imgName.length - 1];
        this.setState({
          src: fullPath[0],
          image: {
            path: fullPath[0],
            border: 'solid black 1px',
            display: 'none',
            backgroundColor: 'white',
          },
          properties: {
            imageName: imgName.split('.')[0],
            imageType: imgName.split('.')[1],
            imageHeight: dimensions.height,
            imageWidth: dimensions.width,
            imageSize: fs.statSync(fullPath.toString()).size / 1000,
          },
          crop: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
          },
        });
        let imagePath = this.state.image.path.split('/');
        imagePath.splice(-1, 1);
        imagePath = imagePath.join('/');
        Jimp.read(this.state.image.path, (err, image) => {
          if (err) throw err;
          image.write(`${imagePath}/${this.state.properties.imageName}_cropped.png`);
        });
      }
    });
  }

  toggleAspectRatio() {
    this.state.aspect = !this.state.aspect;
    if (this.state.aspect) {
      this.state.crop.aspect = 1;
    } else {
      this.state.crop.aspect = 0;
    }
  }

  render() {
    return (
      <Container fluid style={{ padding: '2%' }}>
        <div style={{
          paddingTop: '5vh',
          display: this.state.image.display,
          textAlign: 'center',
          backgroundColor: this.state.image.backgroundColor,
        }}
        >
          <Header as="h2" icon>
            <Icon name="crop" />
                Edit an Image
            <Header.Subheader>Manage your image for your Techfolio!</Header.Subheader>
          </Header>
        </div>
        <div style={{ display: 'block', textAlign: 'center' }}>
          <ReactCrop
            src={this.state.image.path}
            crop={this.state.crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', textAlign: 'center', paddingTop: '2%' }}>
            <Label style={{ color: 'black' }} horizontal>
              Image Name: {this.state.properties.imageName}
            </Label>
          </div>
          <div style={{ display: 'inline-block', textAlign: 'center', paddingTop: '2%' }}>
            <Label style={{ color: 'black' }} horizontal>
              Image Type: {this.state.properties.imageType}
            </Label>
          </div>
          <div style={{ display: 'inline-block', textAlign: 'center', paddingTop: '2%' }}>
            <Label style={{ color: 'black' }} horizontal>
              Image Height: {this.state.properties.imageHeight}
            </Label>
          </div>
          <div style={{ display: 'inline-block', textAlign: 'center', paddingTop: '2%' }}>
            <Label style={{ color: 'black' }} horizontal>
              Image Width: {this.state.properties.imageWidth}
            </Label>
          </div>
          <div style={{ display: 'inline-block', textAlign: 'center', paddingTop: '2%' }}>
            <Label style={{ color: 'black' }} horizontal>
              Image Size: {this.state.properties.imageSize} KB
            </Label>
          </div>
        </div>
        <Divider />
        <Checkbox toggle label={<label htmlFor="Checkbox">Toggle Fixed Square Aspect Ratio</label>} onClick={this.toggleAspectRatio} />
        <div>
          <Button size="massive" color="grey" onClick={this.selectImage} fluid>Choose an image!</Button>
          <br />
          <Button size="massive" color="blue" onClick={this.saveCrop} fluid>Save Changes</Button>
          <br />
          <Button size="massive" color="red" onClick={this.resetImage} fluid>Reset Changes</Button>
        </div>
      </Container>
    );
  }
}
