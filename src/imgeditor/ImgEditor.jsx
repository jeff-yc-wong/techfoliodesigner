import React from 'react';
import PropTypes from 'prop-types';
// import path from 'path';

// const fs = require('fs');

require('../lib/autorefresh.ext');

export default class ImgEditor extends React.Component {
  // constructor(props) {
  //   super(props);
  //   console.log(props.fileName);
  //   // this.props.image;
  //   // this.onBeforeChange = this.onBeforeChange.bind(this);
  //   // this.setWindowTitle = this.setWindowTitle.bind(this);
  //   // // this.copy = this.copy.bind(this);
  //   // // this.paste = this.paste.bind(this);
  //   // this.window = require('electron').remote.getCurrentWindow(); //eslint-disable-line
  //   // this.window.setTitle(this.props.fileName);
  // }
  // figure out how to change image after initial rendering
  // how to import image from /images/
  render() {
    return (
      <div>
        <img src={this.props.image} alt="Preview" className="cropimage" />
        <h2>BADA BING BADA BOOM</h2>
      </div>
    );
  }
}

ImgEditor.propTypes = {
  // directory: PropTypes.string.isRequired,
  // fileType: PropTypes.string.isRequired,
  // fileName: PropTypes.string.isRequired,
  image: PropTypes.string,
};

ImgEditor.defaultProps = {
  image: 'https://secure.img2-ag.wfcdn.com/im/57266972/resize-' +
      'h800-w800%5Ecompr-r85/4307/43074449/Hanging+Pug+Puppy+Statue.jpg',
};
