import { BrowserWindow, app } from 'electron';

async function createSimpleBioEditorWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 500,
    height: 400,
    title: 'Bio Editor',
  });

  // Add a global reference so window doesn't get garbage collected.
  app.bioEditor = window;

  // Load SplashPage.html.
  window.loadURL(`file://${__dirname}/SimpleBioEditorPage.html`);

  window.on('closed', () => {
    // Dereference the window object.
    app.bioEditor = null;
  });
}

export default createSimpleBioEditorWindow;
