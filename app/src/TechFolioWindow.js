import { BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import techFolioWindowManager from './TechFolioWindowManager';

async function createTechFolioWindow({ isDevMode = true, fileType = '', fileName = '' }) {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 1080,
    minWidth: 680,
    height: 840,
    title: 'TechFolio Designer',
  });

  // Unique string representing this file.
  // It's possible to have both an essay and a project with the same file name.
  const fileID = `${fileType}-${fileName}`;

  // Add a global reference.
  techFolioWindowManager.addWindow(fileID, window);

  // Load the index.html of the app.
  window.loadURL(`file://${__dirname}/index.html?fileType=${fileType}&fileName=${fileName}`);

  // Install DevTools
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    // mainWindow.webContents.openDevTools();
  }

  window.on('closed', () => {
    // Dereference the window object.
    techFolioWindowManager.removeWindow(fileID);
  });
}

export default createTechFolioWindow;
