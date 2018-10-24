import { Menu, dialog } from 'electron';
import { _ } from 'underscore';
import TechFolioFiles from '../shared/TechFolioFiles';
import { createTechFolioWindow, newTechFolioWindow } from '../techfolioeditor/TechFolioEditorWindow';
import createSimpleBioEditorWindow from '../simplebioeditor/SimpleBioEditorWindow';
import makeMenuTemplate from './MenuTemplate';
import buildConfigSubMenu from './ConfigSubMenu';
import mainStore from '../redux/mainstore';
import techFolioWindowManager from '../shared/TechFolioWindowManager';
import buildHelpMenu from './HelpMenu';

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
  const techFolioWindowEnabled = !(techFolioWindowManager.getWindow('_data', fileName, 'SimpleBioEditor'));
  const simpleBioEditorWindowEnabled = !(techFolioWindowManager.getWindow('_data', fileName, 'TechfolioWindow'));

  const bioSubMenu = [
    { label: fileName, click: () => createTechFolioWindow({ fileType: '_data', fileName }), enabled: techFolioWindowEnabled }, // eslint-disable-line
    { label: 'Simple Bio Editor', click: () => createSimpleBioEditorWindow(), enabled: simpleBioEditorWindowEnabled },
  ];
  template[indexOfMenuItem(template, 'Bio')].submenu = bioSubMenu;
}

function buildConfigMenu(template) {
  template[indexOfMenuItem(template, 'Config')].submenu = buildConfigSubMenu();
}

function buildEditmenu(template) {
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
  const helpSubMenu = [
    {
      label: 'Getting Started',
      click: () => dialog.showMessageBox({
        message:
        'Welcome to Techfolio Designer!\n\n' +
        '1) To get started, login to GitHub using the Config menu. ' +
        'From here, set the Github repo name of your Techfolio, which will look like this: "(MyGitHubUsername).github.io".\n' + // eslint-disable-line
        '2) Go to "Clone Repo into Directory" in the Config menu, and select the folder ' +
        'where you would like to copy your online Techfolio to your computer for local editing.\n' +
        '3) Once you\'re done editing your techfolio, it\'s time to put it up online. ' +
        'Simply click "Push Changes to GitHub" in the Config menu.\n' +
        "4) Now you're ready to go! Check out our other Help Menu options for more information.",
      }),
    },
    {
      label: 'Splash Page',
      click: () => dialog.showMessageBox({
        message:
        'The Splash Page has three parts to it: Splash Table, Command Logs, and File Manager.\n' +
        'The Splash Table on the left consists of five rows, which tell you the status of your Techfolio.\n' +
        'The Command Logs below it will show you a log of everything Techfolio Designer does.\n' + // eslint-disable-line
        'The File Manager on the right allows you to manage both your projects and essays.',
      }),
    },
      // todo Projects/essays and image creation. Our design is not finalized as of yet
    {
      label: 'Editing Projects and Essays',
      click: () => dialog.showMessageBox({
        message:
        'todo accessing text editor\n\n' +
        'Once you have created/opened your file for editing, you can write it using Techfolio\'s own text editor.\n' + // eslint-disable-line
        'Techfolio Designer comes with it\'s own TfLint technology, which parses your file for common mistakes most users make.' + // eslint-disable-line
        'TfLint will run when your file is saved (with Ctrl/Cmd + S), or by using the keybinding (Ctrl/Cmd + L).',
      }),
    },
    {
      label: 'Adding Images',
      click: () => dialog.showMessageBox({
        message: 'todo',

      }),
    },
    {
      type: 'separator',
    },
    {
      label: 'Shortcuts',
      click: () => dialog.showMessageBox({
        message:
        'Text Editor\n' +
        'Ctrl/Cmd + S: Save\n' +
        'Ctrl/Cmd + L: Run TfLint Essay Checking',
      }),
    },
  ];
  template[indexOfMenuItem(template, 'Help')].submenu = helpSubMenu;
}

/**
 * Builds (or rebuilds) the application menu based upon the current state of the application.
 */
function buildMainMenu() {
  const template = makeMenuTemplate();
  buildEditmenu(template);
  buildConfigMenu(template);
  buildHelpMenu(template);
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
