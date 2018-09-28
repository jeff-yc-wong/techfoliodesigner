import React from 'react';
import PropTypes from 'prop-types';
// import path from 'path';

// const fs = require('fs');

require('../lib/autorefresh.ext');

export default class ImgEditor extends React.Component {

  render() {
    return (
      <div>
        <img src={this.props.image} alt="Preview" className="cropimage" />
        <h2>{ this.props.fileName }</h2>
      </div>
    );
  }
}

ImgEditor.propTypes = {
  // directory: PropTypes.string.isRequired,
  // fileType: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  image: PropTypes.string,
};

ImgEditor.defaultProps = {
  image: 'https://secure.img2-ag.wfcdn.com/im/57266972/resize-' +
      'h800-w800%5Ecompr-r85/4307/43074449/Hanging+Pug+Puppy+Statue.jpg',
};
