import TechFolioFiles from './TechFolioFiles';

const { Menu } = require('electron');
const electron = require('electron');

const app = electron.app;

const template = [
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
    label: 'Bio',
    submenu: [
      { label: 'Basics' },
      { label: 'Location' },
      { label: 'Profiles' },
      { label: 'Work' },
      { label: 'Volunteer' },
      { label: 'Education' },
      { label: 'Skills' },
      { label: 'Interests' },
      { label: 'References' },
    ],
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

function buildMainMenu(directory) {
  const techFolioFiles = new TechFolioFiles(directory);
  const projectFiles = techFolioFiles.projectFileNames();
  const projectsSubMenu = projectFiles.map(file => ({ label: file }));
  template[5].submenu = projectsSubMenu;
  const essayFiles = techFolioFiles.essayFileNames();
  const essaysSubMenu = essayFiles.map(file => ({ label: file }));
  template[6].submenu = essaysSubMenu;
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

export default buildMainMenu;
