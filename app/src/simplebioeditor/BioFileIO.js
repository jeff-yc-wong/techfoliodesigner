import Notify from 'notifyjs'; // WARNING: this import fails when file is loaded in main process.
import path from 'path';

const fs = require('fs');

/**
 * Renderer (remote side) function to write out the bio.json file.
 * Creates a notification.
 * @param bio An object containing the bio.json data.
 */
export function writeBioFile(directory, bio, msg = 'File saved') {  //eslint-disable-line
  const fileType = '_data';
  const fileName = 'bio.json';
  const filePath = path.join(directory, fileType, fileName);
  const bioString = JSON.stringify(bio, null, 2);
  fs.writeFile(filePath, bioString, 'utf8', (err) => {
    const body = (err) ? `File write error: ${err}` : msg;
    const notification = new Notify('bio.json', { body, renotify: true, tag: 'bio.json' });
    if (!Notify.needsPermission) {
      notification.show();
    } else if (Notify.isSupported()) {
      Notify.requestPermission(() => notification.show(), () => console.log('notification denied')); // eslint-disable-line
    }
  });
}

// /**
//  * Returns the bio.json file as an object if it exists and is parsable, null otherwise.
//  */
// export function readBioFile() {
//   const app = require('electron').remote.app; //eslint-disable-line
//   const directory = app.techFolioWindowManager.getDirectory();
//   const fileType = '_data';
//   const fileName = 'bio.json';
//   const filePath = path.join(directory, fileType, fileName);
//   if (!fs.existsSync(filePath)) {
//     return null;
//   }
//   const bioFileData = fs.readFileSync(filePath, 'utf8');
//   let validJSON = true;
//   let bioJSON = null;
//   try {
//     bioJSON = JSON.parse(bioFileData);
//   } catch (e) {
//     validJSON = false;
//   }
//   return (validJSON) ? bioJSON : null;
// }
