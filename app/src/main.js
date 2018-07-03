import { app } from 'electron';
import { enableLiveReload } from 'electron-compile';
import buildMainMenu from './MainMenu';
import techFolioWindowManager from './TechFolioWindowManager';
import createTechFolioWindow from './TechFolioWindow';

// Development mode utilities.
const isDevMode = process.execPath.match(/[\\/]electron/);
if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

// Create an initial window and display the TechFolio menubar.
app.on('ready', () => { createTechFolioWindow({ isDevMode }); buildMainMenu(); });

// Quit when all windows are closed, except on MacOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X, create a window in the app when the dock icon is clicked and there are no other windows open.
  if (techFolioWindowManager.noWindows()) {
    createTechFolioWindow({ isDevMode });
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

