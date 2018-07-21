import { BrowserWindow, dialog } from 'electron';
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

export async function createTechFolioWindow({ isDevMode = true, fileType = '', fileName = '' }) {
  const directory = mainStore.getState().dir;
  const filePath = path.join(directory, fileType, fileName);
  const currWindow = techFolioWindowManager.getWindow(fileType, fileName);
  if (currWindow) {
    currWindow.show();
  } else if (fs.existsSync(filePath)) {
    // Create the browser window.
    const window = new BrowserWindow({
      x: techFolioWindowManager.getXOffset(),
      y: techFolioWindowManager.getYOffset(),
      width: 1080,
      minWidth: 680,
      height: 840,
      title: 'TechFolio Designer',
    });

    // Tell the window manager that this window has been created.
    techFolioWindowManager.addWindow(fileType, fileName, window);

    // Load the index.html of the app.
    window.loadURL(
      `file://${__dirname}/TechFolioEditorPage.html?fileType=${fileType}&fileName=${fileName}&directory=${directory}`);

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
    () => { createTechFolioWindow({ fileType, fileName }); buildMainMenu(); runAddFile(filePath); });
  return null;
}

