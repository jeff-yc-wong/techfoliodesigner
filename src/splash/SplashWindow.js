import { BrowserWindow } from 'electron';
import techFolioWindowManager from '../shared/TechFolioWindowManager';

async function createSplashWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 1200,
    height: 720,
    title: 'TechFolio Designer',
  });

  // Add a global reference so window doesn't get garbage collected.
  techFolioWindowManager.setSplashWindow(window);

  // Load SplashPage.html.
  window.loadURL(`file://${__dirname}/SplashPage.html`);

  window.on('closed', () => {
    // Dereference the window so it can be garbage collected.
    techFolioWindowManager.clearSplashWindow();
  });
}

export default createSplashWindow;
