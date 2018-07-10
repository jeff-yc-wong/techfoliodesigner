import { BrowserWindow, app, dialog } from 'electron';
import fs from 'fs-extra';
import path from 'path';

export function writeBioAsJson(bio) {
  const app = require('electron').remote.app; //eslint-disable-line
  const directory = app.techFolioWindowManager.getDirectory();
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
      Notify.requestPermission(() => notification.show(), () => console.log('notification denied'));
    }
  });
}

/**
 * Returns the bio.json file as an object if it exists and is parsable, null otherwise.
 * @param Pass in app if you are calling this function from the renderer side.
 */
export function getBioAsJson(appVal) {
  const theApp = appVal || app;
  const directory = theApp.techFolioWindowManager.getDirectory();
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
  const currWindow = app.techFolioWindowManager.getWindow(fileType, fileName);
  if (currWindow) {
    currWindow.show();
  } else {
    const bioJSON = getBioAsJson();
    if (!bioJSON) {
      dialog.showErrorBox('Bad Bio File', 'bio.json is not valid JSON. Please correct in the bio.json text editor.');
    } else {
      // Create the browser window.
      const window = new BrowserWindow({
        x: app.techFolioWindowManager.getXOffset(),
        y: app.techFolioWindowManager.getYOffset(),
        width: 1080,
        minWidth: 800,
        height: 840,
        title: 'Bio.json',
      });

      // Tell the window manager that this window has been created.
      app.techFolioWindowManager.addWindow(fileType, fileName, window);

      // Load SplashPage.html.
      window.loadURL(`file://${__dirname}/SimpleBioEditorPage.html`);

      window.on('closed', () => {
        // Dereference the window object.
        app.techFolioWindowManager.removeWindow(fileType, fileName);
      });
    }
  }
}

export default createSimpleBioEditorWindow;
