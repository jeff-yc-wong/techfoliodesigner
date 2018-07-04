import { BrowserWindow, app } from 'electron';

async function createSplashWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 500,
    height: 400,
    title: 'TechFolio Designer',
  });

  // Add a global reference so window doesn't get garbage collected.
  app.splashWindow = window;

  // Load splash.html.
  window.loadURL(`file://${__dirname}/splash.html`);

  window.on('closed', () => {
    // Dereference the window object.
    app.splashWindow = null;
  });
}

export default createSplashWindow;
