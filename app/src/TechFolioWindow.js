import { BrowserWindow, app } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import fs from 'fs-extra';
import path from 'path';

async function createTechFolioWindow({ isDevMode = true, fileType = '', fileName = '' }) {
  const directory = app.techFolioWindowManager.getDirectory();
  const filePath = path.join(directory, fileType, fileName);
  if (!app.techFolioWindowManager.getWindow(fileType, fileName) && fs.existsSync(filePath)) {
    // Create the browser window.
    const x = app.techFolioWindowManager.getXOffset();
    const y = app.techFolioWindowManager.getYOffset();
    console.log(x, y);
    const window = new BrowserWindow({
      x,
      y,
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

    window.on('closed', () => {
      // Dereference the window object.
      app.techFolioWindowManager.removeWindow(fileType, fileName);
    });
  }
}

export default createTechFolioWindow;
