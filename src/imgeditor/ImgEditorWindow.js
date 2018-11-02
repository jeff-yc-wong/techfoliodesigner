import { BrowserWindow, dialog } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';
import mainStore from '../redux/mainstore';
import techFolioWindowManager from '../shared/TechFolioWindowManager';

const fs = require('fs');

export async function createImgEditorWindow({ isDevMode = true, fileType = '', fileName = '' }) { // eslint-disable-line
  const directory = mainStore.getState().dir;
  const filePath = path.join(directory, fileType, fileName);
  const currWindow = techFolioWindowManager.getWindow(fileType, fileName);

  if (currWindow) {
    currWindow.show();
  } else if (fs.existsSync(filePath)) {
    const window = new BrowserWindow({
      x: techFolioWindowManager.getXOffset(),
      y: techFolioWindowManager.getYOffset(),
      width: 1080,
      minWidth: 680,
      height: 840,
      title: 'TechFolio Image Editor',
    });

    window.loadURL(
        `file://${__dirname}/ImgEditorPage.html?fileType=${fileType}&fileName=${fileName}&directory=${directory}`);
    if (isDevMode) {
      await installExtension(REACT_DEVELOPER_TOOLS);
      // currWindow.webContents.openDevTools();
    }

    window.on('close', (e) => {
      e.preventDefault();
      const options = {
        type: 'info',
        title: 'Do you really want to close this window?',
        message: 'This window has unsaved changes. Close anyway?',
        buttons: ['No', 'Yes, lose my changes'],
      };
      dialog.showMessageBox(options, (index) => {
        if (index === 1) {
          window.destroy();
        }
      });
    });

    window.on('closed', () => {
        // Dereference the window object.
      techFolioWindowManager.removeWindow(fileType, fileName);
    });
    techFolioWindowManager.addWindow(fileType, fileName, window);
  }
}
