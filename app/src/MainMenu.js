import electron, { Menu, dialog } from 'electron';
import { _ } from 'underscore';
import TechFolioFiles from './TechFolioFiles';
import createTechFolioWindow from './TechFolioWindow';

const app = electron.app;

let template = [];

function indexOfMenuItem(label) {
  // console.log(label, template);
  return _.findIndex(template, element => element.label && element.label.toUpperCase() === label.toUpperCase());
}

function buildMainMenu(directory) {
  if (directory) {
    app.techFolioWindowManager.setDirectory(directory);
    const techFolioFiles = new TechFolioFiles(directory);
    const invalidDirectoryMessage = techFolioFiles.isInvalidDirectory();
    if (invalidDirectoryMessage) {
      dialog.showErrorBox('Invalid Directory', invalidDirectoryMessage);
      template[indexOfMenuItem('Bio')].submenu = [];
      template[indexOfMenuItem('Projects')].submenu = [];
      template[indexOfMenuItem('Essays')].submenu = [];
    } else {
      const projectFiles = techFolioFiles.projectFileNames();
      const projectsSubMenu = projectFiles.map(
        fileName => ({ label: fileName, click: () => createTechFolioWindow({ fileType: 'projects', fileName }) }));
      projectsSubMenu.push({ type: 'separator' });
      projectsSubMenu.push({ label: 'New Project' });
      template[indexOfMenuItem('Projects')].submenu = projectsSubMenu;

      const essayFiles = techFolioFiles.essayFileNames();
      const essaysSubMenu = essayFiles.map(
        fileName => ({ label: fileName, click: () => createTechFolioWindow({ fileType: 'essays', fileName }) }));
      essaysSubMenu.push({ type: 'separator' });
      essaysSubMenu.push({ label: 'New Essay' });
      template[indexOfMenuItem('Essays')].submenu = essaysSubMenu;

      const bioSubMenu = [{ label: 'bio.json' }];
      template[indexOfMenuItem('Bio')].submenu = bioSubMenu;
    }
  }
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

template = [
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { role: 'selectall' },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        },
      },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' },
    ],
  },
  {
    label: 'Config',
    submenu: [
      { label: 'Set Techfolio Directory',
        click: () => {
          dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => {
            if (files) {
              const directory = files[0];
              app.techFolioWindowManager.setDirectory(directory);
              buildMainMenu(directory);
            }
          });
        } },
    ],
  },
  {
    label: 'Bio',
    submenu: [],
  },
  {
    label: 'Projects',
    submenu: [],
  },
  {
    label: 'Essays',
    submenu: [],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click() {
          require('electron').shell.openExternal('http://electron.atom.io'); //eslint-disable-line
        },
      },
    ],
  },
];

if (process.platform === 'darwin') {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services', submenu: [] },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  });
  // Edit menu.
  template[1].submenu.push(
    { type: 'separator' },
    { label: 'Speech',
      submenu: [
        { role: 'startspeaking' },
        { role: 'stopspeaking' },
      ],
    },
  );
  // Window menu.
  template[3].submenu = [
    { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
    { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
    { label: 'Zoom', role: 'zoom' },
    { type: 'separator' },
    { label: 'Bring All to Front', role: 'front' },
  ];
}

export default buildMainMenu;
