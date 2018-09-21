import { BrowserWindow, dialog } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';
// import prompt from 'electron-prompt';
// import moment from 'moment';
// import buildMainMenu from '../main/MainMenu';
// import { runAddFile } from '../main/Git';
import mainStore from '../redux/mainstore';
import techFolioWindowManager from '../shared/TechFolioWindowManager';
// import TechFolioFiles from '../shared/TechFolioFiles';

const fs = require('fs');

export async function createImgEditorWindow({ isDevMode = true, fileType = '', fileName = '' }) {
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

    window.loadURL(`file://${__dirname}/imgEditorPage.html?fileType=${fileType}&fileName=${fileName}&directory=${directory}`);
    if (isDevMode) {
      await installExtension(REACT_DEVELOPER_TOOLS);
        // mainWindow.webContents.openDevTools();
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
