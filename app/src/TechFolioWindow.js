import { BrowserWindow, app, dialog } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import fs from 'fs-extra';
import path from 'path';

async function createTechFolioWindow({ isDevMode = true, fileType = '', fileName = '' }) {
  const directory = app.techFolioWindowManager.getDirectory();
  const filePath = path.join(directory, fileType, fileName);
  const currWindow = app.techFolioWindowManager.getWindow(fileType, fileName);
  if (currWindow) {
    currWindow.show();
  } else if (fs.existsSync(filePath)) {
    // Create the browser window.
    const window = new BrowserWindow({
      x: app.techFolioWindowManager.getXOffset(),
      y: app.techFolioWindowManager.getYOffset(),
      width: 1080,
      minWidth: 680,
      height: 840,
      title: 'TechFolio Designer',
    });

    // Tell the window manager that this window has been created.
    app.techFolioWindowManager.addWindow(fileType, fileName, window);

    // Load the index.html of the app.
    window.loadURL(`file://${__dirname}/index.html?fileType=${fileType}&fileName=${fileName}`);

    // Install DevTools
    if (isDevMode) {
      await installExtension(REACT_DEVELOPER_TOOLS);
      // mainWindow.webContents.openDevTools();
    }

    // window.onbeforeunload = (e) => {
    //   console.log('I do not want to be closed');
    //   e.returnValue = false;
    //   return false;
    //
    //   // if (window.getTitle().startsWith('*')) {
    //   //   const options = {
    //   //     type: 'info',
    //   //     title: 'Do you really want to close this window?',
    //   //     message: 'This window has unsaved changes. Close anyway?',
    //   //     buttons: ['No', 'Yes, lose my changes'],
    //   //   };
    //   //   dialog.showMessageBox(options), (index) => {  //eslint-disable-line
    //   //     if (true) {
    //   //       e.returnValue = true;
    //   //     } else {
    //   //       window.close();
    //   //     }
    //   //   };
    //   // }
    // };

    window.on('close', (e) => {
      e.preventDefault();
      if (window.getTitle().startsWith('*')) {
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
      }
    });


    window.on('closed', () => {
      // Dereference the window object.
      app.techFolioWindowManager.removeWindow(fileType, fileName);
    });
  }
}

export default createTechFolioWindow;
