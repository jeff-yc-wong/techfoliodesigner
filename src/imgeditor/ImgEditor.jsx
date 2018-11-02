import React from 'react';
import ReactCrop from 'react-image-crop';
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
        number: 0,
        path: '',
        cPath: '',
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
    this.saveImage = this.saveImage.bind(this);
    this.cropImage = this.cropImage.bind(this);
    this.resetImage = this.resetImage.bind(this);
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

  saveImage() {
    const options = {
      type: 'info',
      title: 'Image has been saved!',
      message: 'The image has been successfully cropped and saved!',
      buttons: ['Okay'],
    };
    Jimp.read(this.state.image.cPath, (error, image) => {
      if (error) throw error;
      image.write(this.state.image.path);
      let imgName = this.state.image.path.toString().split('/');
      let imgPath = this.state.image.path.split('/');
      imgName = imgName[imgName.length - 1];
      imgName = imgName.split('.')[0];
      imgPath.splice(-1, 1);
      imgPath = imgPath.join('/');
      for (let fileNum = 0; fileNum < this.state.image.number + 1; fileNum += 1) {
        fs.unlink(`${imgPath}/${imgName}_cropped${fileNum}.png`, (err) => {
          if (!err) {
            // console.log('Success!');
          } else {
            // console.log(err);
          }
        });
      }
      this.setState({
        aspect: this.state.aspect,
        src: null,
        image: {
          number: 0,
          path: '',
          cPath: '',
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
      });
      // console.log(this.state);
      dialog.showMessageBox(options);
    });
  }

  cropImage() {
    const cropPath = this.state.image.cPath;
    this.state.image.number += 1;

    let imgName = this.state.image.path.toString().split('/');
    let imgPath = this.state.image.path.split('/');
    imgName = imgName[imgName.length - 1];
    imgName = imgName.split('.')[0];

    imgPath.splice(-1, 1);
    imgPath = imgPath.join('/');

    Jimp.read(cropPath, (err, image) => {
      if (err) throw err;
      image.crop(
          ((this.state.crop.x / 100) * this.state.properties.imageWidth),
          ((this.state.crop.y / 100) * this.state.properties.imageHeight),
          ((this.state.crop.width / 100) * this.state.properties.imageWidth),
          ((this.state.crop.height / 100) * this.state.properties.imageHeight),
      ).write(`${imgPath}/${imgName}_cropped${this.state.image.number}.png`);
      this.updateImage(`${imgPath}/${imgName}_cropped${this.state.image.number}.png`);
    });
  }

  updateImage(cropPath) {
    Jimp.read(cropPath, (err) => {
      if (err) throw err;
      const dimensions = sizeOf(cropPath);
      this.setState({
        src: cropPath,
        image: {
          number: this.state.image.number,
          path: this.state.image.path,
          cPath: cropPath,
          border: 'solid black 1px',
          display: 'none',
          backgroundColor: 'white',
        },
        properties: {
          imageName: this.state.properties.imageName,
          imageType: this.state.properties.imageType,
          imageHeight: dimensions.height,
          imageWidth: dimensions.width,
          imageSize: fs.statSync(this.state.image.cPath.toString()).size / 1000,
        },
        crop: {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        },
      });
    });
  }

  resetImage() {
    this.updateImage(this.state.image.path);
    this.state.image.number = 0;
  }

  selectImage() {
    if (this.state.image.cPath !== '') {
      let imgName = this.state.image.path.toString().split('/');
      let imgPath = this.state.image.path.split('/');
      imgName = imgName[imgName.length - 1];
      imgName = imgName.split('.')[0];
      imgPath.splice(-1, 1);
      imgPath = imgPath.join('/');

      for (let fileNum = 0; fileNum < this.state.image.number + 1; fileNum += 1) {
        fs.unlink(`${imgPath}/${imgName}_cropped${fileNum}.png`, (err) => {
          if (!err) {
            // console.log('Success!');
          } else {
            // console.log(err);
          }
        });
      }
      this.state.image.cPath = '';
    }
    dialog.showOpenDialog({
      title: 'Select an image',
      properties: ['openFile'],
      defaultPath: techFolioGitHubManager.getSavedState().dir.concat('/images/'),
      buttonLabel: 'Crop',
    }, (fullPath) => {
      if (fullPath !== undefined) {
        const dimensions = sizeOf(fullPath.toString());
        let imgName = fullPath.toString().split('/');
        let imgPath = fullPath[0].split('/');
        imgName = imgName[imgName.length - 1];
        imgName = imgName.split('.')[0];

        imgPath.splice(-1, 1);
        imgPath = imgPath.join('/');

        this.state.image.number = 0;

        Jimp.read(fullPath[0], (err, image) => {
          if (err) throw err;
          image.write(`${imgPath}/${imgName}_cropped${this.state.image.number}.png`);
        });
        this.setState({
          src: fullPath[0],
          image: {
            number: 0,
            path: fullPath[0],
            cPath: `${imgPath}/${imgName}_cropped${this.state.image.number}.png`,
            border: 'solid black 1px',
            display: 'none',
            backgroundColor: 'white',
          },
          properties: {
            imageName: imgName,
            imageType: this.state.properties.imageType,
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
            src={this.state.src}
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
        <div style={{ textAlign: 'center', paddingTop: '1%' }}>
          <Checkbox
            toggle
            label={<label htmlFor="Checkbox">
            Toggle Fixed Square Aspect Ratio</label>}
            onClick={this.toggleAspectRatio}
          />
        </div>
        <Divider />
        <div style={{ textAlign: 'center' }}>
          <Button size="massive" color="grey" onClick={this.selectImage} >Choose Image</Button>
          <Button size="massive" color="blue" onClick={this.cropImage} >Crop</Button>
          <Button size="massive" color="blue" onClick={this.saveImage} >Save</Button>
          <Button size="massive" color="red" onClick={this.resetImage} >Reset</Button>
        </div>
      </Container>
    );
  }
}
