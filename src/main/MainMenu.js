import { Menu, dialog } from 'electron';
import { _ } from 'underscore';
// import path from 'path';
import moment from 'moment';
import TechFolioFiles from '../shared/TechFolioFiles';
import { createTechFolioWindow, newTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';
import { createImgEditorWindow } from '../imgeditor/ImgEditorWindow';
import createSimpleBioEditorWindow from '../simplebioeditor/SimpleBioEditorWindow';
import makeMenuTemplate from './MenuTemplate';
import buildConfigSubMenu from './ConfigSubMenu';
import * as action from '../redux/actions';
import mainStore from '../redux/mainstore';
import techFolioGitHubManager from '../shared/TechFolioGitHubManager';
import techFolioWindowManager from '../shared/TechFolioWindowManager';
import buildHelpSubMenu from './HelpMenu';


const fs = require('fs');
const Jimp = require('jimp');

// let imgPath;

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
    properties: ['openFile', 'multiSelections'],
    // defaultPath: techFolioGitHubManager.getSavedState().dir.concat('/images/'),
    defaultPath: 'Downloads',
    buttonLabel: 'Import',
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] },
    ],
  }, (fullPath) => {
    if (fullPath !== undefined) {
      for (let path = 0; path < fullPath.length; path += 1) {
        const imageName = fullPath[path].split('\\').pop().split('/').pop(); // convert fullPath to just imageName
        const localImgDir = techFolioGitHubManager.getSavedState().dir.concat('/images/');
        const localImgLoc = techFolioGitHubManager.getSavedState().dir.concat(`/images/${imageName}`);
        if (fullPath[path].toString() !== localImgLoc) {
          if (fs.statSync(fullPath[path].toString()).size > 500000) {
            Jimp.read(fullPath[path].toString(), (err, image) => {
              if (err) throw err;
              image
                  .quality(0)
                  .scale(0.45)
                  .write(localImgLoc);
            });
          } else {
            Jimp.read(fullPath[path].toString(), (err, lenna) => {
              if (err) throw err;
              lenna.write(localImgLoc); // save
            });
          }
          if (path === fullPath.length - 1) {
            dialog.showMessageBox({
              type: 'question',
              message: 'Success!',
              detail: 'The image has been successfully imported!',
            });
          }
        } else {
          dialog.showErrorBox('Error', `Image already exists in ${localImgDir}`);
          break;
        }
      }
    }
  });
}

/** Prompts the user to select an image to remove from their local repo's /images/ folder. */
function removeImage() {
  dialog.showOpenDialog({
    title: 'Select an Image',
    properties: ['openFile', 'multiSelections'],
    defaultPath: techFolioGitHubManager.getSavedState().dir.concat('/images/'),
    buttonLabel: 'Delete',
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg'] },
    ],
  }, (fullPath) => {
    if (fullPath !== undefined) {
      for (let path = 0; path < fullPath.length; path += 1) {
        fs.unlink(fullPath[path], (err) => {
          if (!err) {
            if (path === fullPath.length - 1) {
              dialog.showMessageBox({
                type: 'question',
                message: 'Success!',
                detail: 'The image(s) has been successfully deleted!',
              });
            }
          } else {
            dialog.showErrorBox('Error', err);
          }
        });
      }
    }
  });
}

function cropImage() {
  createImgEditorWindow({ fileType: 'images' });

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
  const techFolioWindowEnabled = !(techFolioWindowManager.getWindow('_data', fileName, 'SimpleBioEditor'));
  const simpleBioEditorWindowEnabled = !(techFolioWindowManager.getWindow('_data', fileName, 'TechfolioWindow'));

  const bioSubMenu = [
    {
      label: fileName,
      click: () => createTechFolioWindow({ fileType: '_data', fileName }),
      enabled: techFolioWindowEnabled,
    },
    { label: 'Simple Bio Editor',
      click: () => createSimpleBioEditorWindow(),
      enabled: simpleBioEditorWindowEnabled,
    },
  ];
  template[indexOfMenuItem(template, 'Bio')].submenu = bioSubMenu;
}

function buildConfigMenu(template) {
  template[indexOfMenuItem(template, 'Config')].submenu = buildConfigSubMenu();
}

function buildFileData(techFolioFiles) {
  const projectFiles = techFolioFiles.projectFileNames();
  const essayFiles = techFolioFiles.essayFileNames();
  const projectObjects = projectFiles.map((project) => {
    // const modified = fs.stat(mainStore.getState().dir.concat(`/projects/${project}`));
    const mtime = fs.statSync(mainStore.getState().dir.concat(`/projects/${project}`)).mtime;
    return ({ key: `project-${project}`, fileName: project, fileType: 'projects', modified: moment(mtime).fromNow() });
  });
  const essayObjects = essayFiles.map((essay) => {
    const mtime = fs.statSync(mainStore.getState().dir.concat(`/essays/${essay}`)).mtime;
    return ({ key: `essay-${essay}`, fileName: essay, fileType: 'essays', modified: moment(mtime).fromNow() });
  });
  const fileData = projectObjects.concat(essayObjects);
  mainStore.dispatch(action.setFileData(fileData));
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

function buildHelpMenu(template) {
  template[indexOfMenuItem(template, 'Help')].submenu = buildHelpSubMenu();
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
      click: cropImage,
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
  buildHelpMenu(template);
  const directory = mainStore.getState().dir;
  buildEditMenu(template);
  buildConfigMenu(template);
  buildImagesMenu(template);
  if (directory) {
    const techFolioFiles = new TechFolioFiles(directory);
    if (techFolioFiles.isInvalidDirectory()) {
      processInvalidDirectory(template, techFolioFiles);
    } else {
      buildProjectsMenu(template, techFolioFiles);
      buildEssaysMenu(template, techFolioFiles);
      buildBioMenu(template);
      buildFileData(techFolioFiles);
    }
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

export default buildMainMenu;
