import { BrowserWindow, dialog } from 'electron';
import path from 'path';
import mainStore from '../redux/mainstore';
import techFolioWindowManager from '../shared/TechFolioWindowManager';

/* global Notify */

const fs = require('fs');

export function writeBioAsJson(bio) {
  const directory = mainStore.getState().dir;
  const fileType = '_data';
  const fileName = 'bio.json';
  const filePath = path.join(directory, fileType, fileName);
  const bioString = JSON.stringify(bio, null, 2);
  fs.writeFile(filePath, bioString, 'utf8', (err) => {
    const body = (err) ? `File write error: ${err}` : 'File saved.';
    const notification = new Notify('bio.json', { body, renotify: true, tag: 'bio.json' });
    if (!Notify.needsPermission) {
      notification.show();
    } else if (Notify.isSupported()) {
      Notify.requestPermission(() => notification.show(), () => console.log('notification denied')); // eslint-disable-line
    }
  });
}

/**
 * Returns the bio.json file as an object if it exists and is parsable, null otherwise.
 * @param Directory to the local dir.
 */
export function getBioAsJson(directory) {
  const fileType = '_data';
  const fileName = 'bio.json';
  const filePath = path.join(directory, fileType, fileName);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const bioFileData = fs.readFileSync(filePath, 'utf8');
  let validJSON = true;
  let bioJSON = null;
  try {
    bioJSON = JSON.parse(bioFileData);
  } catch (e) {
    validJSON = false;
  }
  return (validJSON) ? bioJSON : null;
}


async function createSimpleBioEditorWindow() {
  const fileType = '_data';
  const fileName = 'bio.json';
  const directory = mainStore.getState().dir;
  const currWindow = techFolioWindowManager.getWindow(fileType, fileName);
  if (currWindow) {
    currWindow.show();
  } else {
    const bioJSON = getBioAsJson(directory);
    if (!bioJSON) {
      dialog.showErrorBox('Bad Bio File', 'bio.json is not valid JSON. Please correct in the bio.json text editor.');
    } else {
      // Create the browser window.
      const window = new BrowserWindow({
        x: techFolioWindowManager.getXOffset(),
        y: techFolioWindowManager.getYOffset(),
        width: 1080,
        minWidth: 800,
        height: 840,
        title: 'Bio.json',
      });

      // Tell the window manager that this window has been created.
      techFolioWindowManager.addWindow(fileType, fileName, window);

      // Load html page.
      window.loadURL(`file://${__dirname}/SimpleBioEditorPage.html?directory=${directory}`);

      window.on('closed', () => {
        // Dereference the window object.
        techFolioWindowManager.removeWindow(fileType, fileName);
      });
    }
  }
}

export default createSimpleBioEditorWindow;
