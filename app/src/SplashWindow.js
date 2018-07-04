import { BrowserWindow } from 'electron';
import techFolioWindowManager from './TechFolioWindowManager';

async function createSplashWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    x: 0,
    y: 0,
    width: 500,
    height: 400,
    title: 'TechFolio Designer',
  });

  // Unique string representing this file.
  const fileID = 'Splash-SplashWindow';

  // Add a global reference.
  techFolioWindowManager.addWindow(fileID, window);

  // Load splash.html.
  window.loadURL(`file://${__dirname}/splash.html`);

  window.on('closed', () => {
    // Dereference the window object.
    techFolioWindowManager.removeWindow(fileID);
  });
}

export default createSplashWindow;
