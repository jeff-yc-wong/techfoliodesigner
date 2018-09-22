import { Menu, dialog } from 'electron';
import { _ } from 'underscore';
import TechFolioFiles from '../shared/TechFolioFiles';
import { createTechFolioWindow, newTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';
import createSimpleBioEditorWindow from '../simplebioeditor/SimpleBioEditorWindow';
import makeMenuTemplate from './MenuTemplate';
import buildConfigSubMenu from './ConfigSubMenu';
import mainStore from '../redux/mainstore';
import techFolioGitHubManager from '../shared/TechFolioGitHubManager';

const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

/** Helper function to return the index of the element in template with the passed label. */
function indexOfMenuItem(template, label) {
  return _.findIndex(template, element => element.label && element.label.toUpperCase() === label.toUpperCase());
}

/* eslint no-param-reassign: 0 */
/** If the user specifies a directory that does not contain TechFolio files, then we tell them and clear menus. */
function processInvalidDirectory(template, techFolioFiles) {
  dialog.showErrorBox('Invalid Directory', techFolioFiles.isInvalidDirectory());
  template[indexOfMenuItem(template, 'Bio')].submenu = [];
  template[indexOfMenuItem(template, 'Projects')].submenu = [];
  template[indexOfMenuItem(template, 'Essays')].submenu = [];
}

/** Prompts the user to select an image to import then moves that image to their local repo's /images/ folder. */
function importImage() {
  dialog.showOpenDialog({
    title: 'Select an Image',
    properties: ['openFile'],
  }, (fullPath) => {
    /* This may not work on all machines, since there are a lot of different separators than just '/' */
    const imageName = fullPath[0].split('\\').pop().split('/').pop(); // convert fullPath to just imageName
    const localImgDir = techFolioGitHubManager.getSavedState().dir.concat(`/images/${imageName}`);
    if (fullPath === undefined) {
      dialog.showErrorBox('Error', 'No image selected.');
    } else {
      let imageSize = fs.statSync(fullPath[0]).size / 1000;
      while (imageSize > 500) {
        imagemin(fullPath[0], localImgDir, {
          plugins: [
            imageminJpegtran(),
            imageminPngquant({ quality: '65-80' }),
          ],
        });
        imageSize = fs.statSync(localImgDir).size / 1000;
      }
      fs.copyFile(fullPath[0], localImgDir, (err) => {
        if (err) {
          dialog.showErrorBox('Error', err);
        } else {
          dialog.showMessageBox({
            title: 'Done',
            message: 'Image has been imported',
          });
        }
      });
    }
  });
}

/** Prompts the user to select an image to remove from their local repo's /images/ folder. */
function removeImage() {
  dialog.showOpenDialog({
    title: 'Select an Image',
    properties: ['openFile'],
    defaultPath: techFolioGitHubManager.getSavedState().dir.concat('/images/'),
    buttonLabel: 'Remove',
  }, (fullPath) => {
    if (fullPath === undefined) {
      dialog.showErrorBox('Error', 'No image selected.');
    } else {
      fs.unlink(fullPath[0], (err) => {
        if (err) {
          dialog.showErrorBox('Error', err);
        } else {
          dialog.showMessageBox({
            title: 'Done',
            message: 'Image successfully deleted',
          });
        }
      });
    }
  });
}


function buildProjectsMenu(template, techFolioFiles) {
  const projectFiles = techFolioFiles.projectFileNames();
  const projectsSubMenu = projectFiles.map(
    fileName => ({ label: fileName, click: () => createTechFolioWindow({ fileType: 'projects', fileName }) }));
  projectsSubMenu.push({ type: 'separator' });
  projectsSubMenu.push({ label: 'New Project', click: () => newTechFolioWindow({ fileType: 'projects' }) });
  template[indexOfMenuItem(template, 'Projects')].submenu = projectsSubMenu;
}

function buildEssaysMenu(template, techFolioFiles) {
  const essayFiles = techFolioFiles.essayFileNames();
  const essaysSubMenu = essayFiles.map(
    fileName => ({ label: fileName, click: () => createTechFolioWindow({ fileType: 'essays', fileName }) }));
  essaysSubMenu.push({ type: 'separator' });
  essaysSubMenu.push({ label: 'New Essay', click: () => newTechFolioWindow({ fileType: 'essays' }) });
  template[indexOfMenuItem(template, 'Essays')].submenu = essaysSubMenu;
}

function buildBioMenu(template) {
  const fileName = 'bio.json';
  const bioSubMenu = [
    { label: fileName, click: () => createTechFolioWindow({ fileType: '_data', fileName }) },
    { label: 'Simple Bio Editor', click: () => createSimpleBioEditorWindow() },
  ];
  template[indexOfMenuItem(template, 'Bio')].submenu = bioSubMenu;
}

function buildConfigMenu(template) {
  template[indexOfMenuItem(template, 'Config')].submenu = buildConfigSubMenu();
}

function buildEditMenu(template) {
  const editSubMenu = [
    {
      label: 'Undo (broken)',
      click: () => Menu.webContents.undo(),
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo',
    },
    {
      label: 'Redo (broken)',
      click: () => Menu.webContents.redo(),
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo',
    },
    {
      type: 'separator',
    },
    {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut',
    },
    {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy',
    },
    {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste',
    },
    {
      label: 'Select All (broken)',
      click: () => Menu.webContents.selectAll(),
      accelerator: 'CmdOrCtrl+A',
      role: 'selectAll',
    },
  ];
  template[indexOfMenuItem(template, 'Edit')].submenu = editSubMenu;
}

function buildImagesMenu(template) {
  const imagesSubMenu = [
    {
      label: 'Import Image',
      click: importImage,
    },
    {
      label: 'Remove Image',
      click: removeImage,
    },
    {
      label: 'Crop Image',
    },
  ];
  template[indexOfMenuItem(template, 'Images')].submenu = imagesSubMenu;
}


/**
 * Builds (or rebuilds) the application menu based upon the current state of the application.
 */
function buildMainMenu() {
  const template = makeMenuTemplate();
  buildEditMenu(template);
  buildConfigMenu(template);
  buildImagesMenu(template);
  const directory = mainStore.getState().dir;
  if (directory) {
    const techFolioFiles = new TechFolioFiles(directory);
    if (techFolioFiles.isInvalidDirectory()) {
      processInvalidDirectory(template, techFolioFiles);
    } else {
      buildProjectsMenu(template, techFolioFiles);
      buildEssaysMenu(template, techFolioFiles);
      buildBioMenu(template);
    }
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

export default buildMainMenu;
