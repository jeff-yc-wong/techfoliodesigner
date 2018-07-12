import electron, { Menu, dialog } from 'electron';
import { _ } from 'underscore';
import TechFolioFiles from '../shared/TechFolioFiles';
import { createTechFolioWindow, newTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';
import createSimpleBioEditorWindow from '../simplebioeditor/SimpleBioEditorWindow';
import makeMenuTemplate from './MenuTemplate';
import buildConfigSubMenu from './ConfigSubMenu';

const app = electron.app;

/** Helper function to return the index of the element in template with the passed label. */
function indexOfMenuItem(template, label) {
  return _.findIndex(template, element => element.label && element.label.toUpperCase() === label.toUpperCase());
}

/* eslint no-param-reassign: 0 */
/** If the user specifies a directory that does not contain TechFolio files, then we tell them and clear menus. */
function processInvalidDirectory(template) {
  dialog.showErrorBox('Invalid Directory', app.techFolioFiles.isInvalidDirectory());
  template[indexOfMenuItem(template, 'Bio')].submenu = [];
  template[indexOfMenuItem(template, 'Projects')].submenu = [];
  template[indexOfMenuItem(template, 'Essays')].submenu = [];
}

function buildProjectsMenu(template) {
  const projectFiles = app.techFolioFiles.projectFileNames();
  const projectsSubMenu = projectFiles.map(
    fileName => ({ label: fileName, click: () => createTechFolioWindow({ fileType: 'projects', fileName }) }));
  projectsSubMenu.push({ type: 'separator' });
  projectsSubMenu.push({ label: 'New Project', click: () => newTechFolioWindow({ fileType: 'projects' }) });
  template[indexOfMenuItem(template, 'Projects')].submenu = projectsSubMenu;
}

function buildEssaysMenu(template) {
  const essayFiles = app.techFolioFiles.essayFileNames();
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

/**
 * Builds (or rebuilds) the application menu based upon the current state of the application.
 * Application state is held in app.techFolioWindowManager and app.techFolioGitHubManager.
 */
function buildMainMenu() {
  const template = makeMenuTemplate();
  buildConfigMenu(template);
  const directory = app.techFolioWindowManager.getDirectory();
  if (directory) {
    app.techFolioFiles = new TechFolioFiles(directory);
    if (app.techFolioFiles.isInvalidDirectory()) {
      processInvalidDirectory(template);
    } else {
      buildProjectsMenu(template);
      buildEssaysMenu(template);
      buildBioMenu(template);
    }
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}


export default buildMainMenu;
