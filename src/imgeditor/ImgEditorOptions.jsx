// import React from 'react';
// import techFolioGitHubManager from '../shared/TechFolioGitHubManager';
//
// require('../lib/autorefresh.ext');
//
// const dialog = require('electron').remote.dialog;
//
// export default class ImgEditorOptions extends React.Component {
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       height: '', // could set this to be initial image height
//       width: '',  // could set this to be initial image width
//     };
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }
//
//   handleChange() {
//     this.setState({
//       height: this.state.height,
//       width: this.state.width,
//     });
//   }
//
//   handleSubmit(event) {
//     dialog.showErrorBox('Error', `A value was submitted: ${this.state.width} x ${this.state.height}`);
//     event.preventDefault();
//   }
//
//
//   render() {
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <label>
//           Crop:
//           <input type="text" name="width" onChange={this.handleChange} value={this.state.width} />
//         </label>
//         <br />
//         <label>
//           Height
//           <input type="text" name="height" onChange={this.handleChange} value={this.state.height} />
//         </label>
//         <br />
//         <input type="submit" value="Crop" />
//       </form>
//     );
//   }
// }
