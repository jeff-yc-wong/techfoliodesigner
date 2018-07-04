import { app } from 'electron';
import { enableLiveReload } from 'electron-compile';
import buildMainMenu from './MainMenu';
import techFolioWindowManager from './TechFolioWindowManager';
import createSplashWindow from './SplashWindow';
import createTechFolioWindow from './TechFolioWindow';

// Development mode utilities.
const isDevMode = process.execPath.match(/[\\/]electron/);
if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

// add the techFolioWindowManager to app so it is available everywhere.
app.techFolioWindowManager = techFolioWindowManager;

console.log('user data path', app.getPath('userData'));

function initializeWindows() {
  console.log('starting initialize windows');
  const directory = techFolioWindowManager.getDirectory();
  console.log('directory', directory);
  if (directory) {
    buildMainMenu(directory);
    console.log('about to do essays', techFolioWindowManager.getFileNames('essays'));
    techFolioWindowManager.getFileNames('projects')
      .map(fileName => createTechFolioWindow({ fileType: 'projects', fileName }));
    techFolioWindowManager.getFileNames('essays')
      .map(fileName => createTechFolioWindow({ fileType: 'essays', fileName }));
  } else {
    buildMainMenu();
    createSplashWindow();
  }
}

// Create an initial window and display the TechFolio menubar.
app.on('ready', () => initializeWindows());

// Indicate that application is starting to shut down, so window close events shouldn't delete cache.
app.on('before-quit', () => { app.techFolioWindowManager.setBeforeQuit(); });

// Quit when all windows are closed, except on MacOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X, create a window in the app when the dock icon is clicked and there are no other windows open.
  if (techFolioWindowManager.noWindows()) {
    createSplashWindow();
  }
});
