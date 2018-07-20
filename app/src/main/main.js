import { app } from 'electron';
import { replayActionMain } from 'electron-redux';
import { enableLiveReload } from 'electron-compile';
import buildMainMenu from './MainMenu';
import techFolioWindowManager from '../shared/TechFolioWindowManager';
import techFolioGitHubManager from '../shared/TechFolioGitHubManager';
import createSplashWindow from '../splash/SplashWindow';
import { createTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';
import mainStore from '../redux/mainstore';


// Redux setup
replayActionMain(mainStore);

// Development mode utilities.
const isDevMode = process.execPath.match(/[\\/]electron/);
if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

// add window and github managers to app so they are available everywhere.
app.techFolioWindowManager = techFolioWindowManager;
app.techFolioGitHubManager = techFolioGitHubManager;

function initializeWindows() {
  buildMainMenu();
  if (techFolioWindowManager.getDirectory()) {
    // Restore any windows that were open at time of last exit.
    techFolioWindowManager.getSavedFileNames('projects')
      .map(fileName => createTechFolioWindow({ fileType: 'projects', fileName }));
    techFolioWindowManager.getSavedFileNames('essays')
      .map(fileName => createTechFolioWindow({ fileType: 'essays', fileName }));
    techFolioWindowManager.getSavedFileNames('_data')
      .map(fileName => createTechFolioWindow({ fileType: '_data', fileName }));
  }
  // If no windows were restored, then display the splash window.
  if (techFolioWindowManager.noWindows()) {
    createSplashWindow();
  }
}

// Create an initial window and display the TechFolio menubar.
app.on('ready', () => initializeWindows());

// Indicate that application is starting to shut down, so window close events shouldn't update cache.
app.on('before-quit', () => {
  app.techFolioWindowManager.setBeforeQuit();
});

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
