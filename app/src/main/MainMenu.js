import { Menu, dialog } from 'electron';
import { _ } from 'underscore';
import TechFolioFiles from '../shared/TechFolioFiles';
import { createTechFolioWindow, newTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';
import createSimpleBioEditorWindow from '../simplebioeditor/SimpleBioEditorWindow';
import makeMenuTemplate from './MenuTemplate';
import buildConfigSubMenu from './ConfigSubMenu';
import mainStore from '../redux/mainstore';

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

/**
 * Builds (or rebuilds) the application menu based upon the current state of the application.
 */
function buildMainMenu() {
  const template = makeMenuTemplate();
  buildConfigMenu(template);
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
