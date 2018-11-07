import { dialog, shell, remote, BrowserWindow } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import path from 'path';
import prompt from 'electron-prompt';
import moment from 'moment';
import buildMainMenu from '../main/MainMenu';
import { runAddFile } from '../main/Git';
import mainStore from '../redux/mainstore';
import techFolioWindowManager from '../shared/TechFolioWindowManager';
import TechFolioFiles from '../shared/TechFolioFiles';

const fs = require('fs');
const electron = require('electron');


export async function createTechFolioWindow({ isDevMode = true, fileType = '', fileName = '' }) {
  const isRenderer = (process && process.type === 'renderer');
  console.log(isRenderer);

  const directory = mainStore.getState().dir;
  const filePath = path.join(directory, fileType, fileName);
  const currWindow = techFolioWindowManager.getWindow(fileType, fileName);
  const otherWindow = techFolioWindowManager.getWindowWithName(fileType, fileName, 'SimpleBioEditor');
  if (currWindow) {
    if (otherWindow) {
      dialog.showErrorBox('Opening Multiple Bio Editors is Not Allowed',
        'You can not open multiple bio editors at the same time');
    }
    currWindow.show();
  } else if (fs.existsSync(filePath)) {
    // Create the browser window.
    let window;
    if (isRenderer) {
      const RemoteBrowserWindow = electron.remote.BrowserWindow;
      window = new RemoteBrowserWindow({
        x: techFolioWindowManager.getXOffset(),
        y: techFolioWindowManager.getYOffset(),
        width: 1080,
        minWidth: 680,
        height: 840,
        title: 'TechFolio Designer',
      });
    } else {
      window = new BrowserWindow({
        x: techFolioWindowManager.getXOffset(),
        y: techFolioWindowManager.getYOffset(),
        width: 1080,
        minWidth: 680,
        height: 840,
        title: 'TechFolio Designer',
      });
    }


    // Tell the window manager that this window has been created.
    techFolioWindowManager.addWindowWithName(fileType, fileName, window, 'TechfolioWindow');
    techFolioWindowManager.addWindow(fileType, fileName, window);

    // Tell the mainmenu to rebuild the mainmenu fields to disable and enable suboptions
    buildMainMenu();

    // Load the index.html of the app.
    window.loadURL(
      `file://${__dirname}/TechFolioEditorPage.html?fileType=${fileType}&fileName=${fileName}&directory=${directory}`); // eslint-disable-line

    // Install DevTools
    if (isDevMode) {
      await installExtension(REACT_DEVELOPER_TOOLS);
      // mainWindow.webContents.openDevTools();
    }

    window.on('close', (e) => {
      e.preventDefault();
      if (window.getTitle().startsWith('*')) {
        const options = {
          type: 'info',
          title: 'Do you really want to close this window?',
          message: 'This window has unsaved changes. Close anyway?',
          buttons: ['No', 'Yes, lose my changes'],
        };
        dialog.showMessageBox(options, (index) => {
          if (index === 1) {
            window.destroy();
          }
        });
      } else {
        window.destroy();
      }
    });

    window.on('closed', () => {
      // Dereference the window object.
      techFolioWindowManager.removeWindow(fileType, fileName);
    });

    window.webContents.on('will-navigate', (event, url) => {
      if (url !== window.webContents.getURL()) {
        // Stop Electron from opening links in BrowserWindow
        event.preventDefault();
        // Open URL in default system browser
        shell.openExternal(url);
      }
    });
  }
}

function validFileName(fileName, fileType) {
  if (!fileName) {
    return false;
  }
  if (fileName.length <= 3) {
    return false;
  }
  if (fileName.startsWith('.')) {
    return false;
  }
  if (!fileName.endsWith('.md')) {
    return false;
  }
  if (fileName.indexOf(' ') >= 0) {
    return false;
  }
  const directory = mainStore.getState().dir;
  const techFolioFiles = new TechFolioFiles(directory);
  if (techFolioFiles.fileNames(fileType).includes(fileName)) {
    return false;
  }
  return true;
}

const templateProject = `---
layout: project
type: project
image: images/micromouse.jpg
title: "My Sample Project Title"
date: ${moment().format('YYYY-MM-DD')}
labels:
  - Robotics
summary: My team developed a robotic mouse that won first place in the 2015 UH Micromouse competition.
---
Project description goes here.`;

const templateEssay = `---
layout: essay
type: essay
title: "My Sample Essay Title"
date: ${moment().format('YYYY-MM-DD')}
labels:
  - Engineering
---
Essay goes here.`;

export async function newTechFolioWindow({ fileType }) {
  let fileName = null;
  try {
    fileName = await prompt({
      title: `Create new ${fileType.slice(0, -1)}`,
      label: 'File name:',
      value: 'samplefile.md',
      inputAttrs: { type: 'text', required: 'true' },
    });
  } catch (e) {
    console.log('error in newTechFolioWindow dialog', e); // eslint-disable-line
    return null;
  }
  if (fileName === null) {
    return null;
  }
  if (!validFileName(fileName, fileType)) {
    dialog.showErrorBox('Bad file name',
      'File names must: (1) end with .md, (2) not contain spaces, (3) not already exist.');
    return null;
  }
  const directory = mainStore.getState().dir;
  const filePath = path.join(directory, fileType, fileName);
  const techFolioFiles = new TechFolioFiles(directory);
  techFolioFiles.writeFile(fileType, fileName, (fileType === 'essays') ? templateEssay : templateProject,
    () => {
      createTechFolioWindow({ fileType, fileName });
      buildMainMenu();
      runAddFile(filePath);
    });
  return null;
}

export function deleteFile(fileType, fileName) {
  const options = {
    type: 'warning',
    title: 'Do you really want to delete this file?',
    message: `Are you sure you want to delete ${fileType} ${fileName}? This action cannot be undone.`,
    buttons: ['OK', 'Cancel'],
  };
  dialog.showMessageBox(options, (index) => {
    if (index === 0) {
      fs.unlink(path.join(mainStore.getState().dir, fileType, fileName), (err) => {
        if (err) throw err;
        console.log(`Successfully deleted ${fileType} ${fileName}`);
        buildMainMenu();
      });
    }
  });
}
//
// export function deleteFile(fileType, fileName) {
//   fs.unlink(path.join(mainStore.getState().dir, fileType, fileName), (err) => {
//     if (err) throw err;
//     console.log(`Successfully deleted ${fileType} ${fileName}`);
//     buildMainMenu();
//   });
// }

