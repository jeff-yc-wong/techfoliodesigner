import { app } from 'electron';
import { replayActionMain } from 'electron-redux';
import { enableLiveReload } from 'electron-compile';
import buildMainMenu from './MainMenu';
import techFolioWindowManager from '../shared/TechFolioWindowManager';
import createSplashWindow from '../splash/SplashWindow';
import mainStore from '../redux/mainstore';

// Redux setup
replayActionMain(mainStore);

// Development mode utilities.
const isDevMode = process.execPath.match(/[\\/]electron/);
if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

function initializeWindows() {
  buildMainMenu();
  createSplashWindow();
}

// Build the Main Menu and display the Splash Window.
app.on('ready', () => initializeWindows());

// Indicate that application is starting to shut down, so window close events shouldn't update cache.
app.on('before-quit', () => {
  techFolioWindowManager.setBeforeQuit();
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
