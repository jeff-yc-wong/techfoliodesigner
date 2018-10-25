import techFolioWindowManager from '../shared/TechFolioWindowManager';

const marked = require('marked');
const fs = require('fs');
const { BrowserWindow } = require('electron');
const path = require('path');

function showHelpDialog(label, markdownPath) {
  const markdownText = fs.readFileSync(markdownPath, 'utf-8');
  const htmlText = marked(markdownText);

  let finalHtml = fs.readFileSync('../techfoliodesigner/src/help/BaseHelp.html', 'utf-8');
  finalHtml = finalHtml.concat(htmlText);
  finalHtml = finalHtml.concat('</body>\n</html>');
  fs.writeFileSync('../techfoliodesigner/src/help/HelpMenu.html', finalHtml);

  const win = new BrowserWindow({
    x: techFolioWindowManager.getXOffset(),
    y: techFolioWindowManager.getYOffset(),
    width: 700,
    height: 600,
    title: label,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
  });
  techFolioWindowManager.addHelpWindow(label, win);

  const dirPath = `${__dirname}`.replace('main', '/');
  win.loadURL(`file://${dirPath}help/HelpMenu.html`);
}

export default function buildHelpSubMenu() {
  const helpSubMenu = [
    {
      label: 'Getting Started',
      click: () => showHelpDialog('Getting Started', '../techfoliodesigner/src/help/GettingStarted.md'),
    },
    {
      label: 'Splash Page',
      click: () => showHelpDialog('Splash Page', '../techfoliodesigner/src/help/SplashPage.md'),
    },
    {
      label: 'Editing Projects and Essays',
      click: () => showHelpDialog('Editing Projects and Essays', '../techfoliodesigner/src/help/ProjectsandEssays.md'),
    },
    {
      label: 'Adding Images',
      click: () => showHelpDialog('Adding Images', '../techfoliodesigner/src/help/Images.md'),
    },
    {
      type: 'separator',
    },
    {
      label: 'Shortcuts',
      click: () => showHelpDialog('Shortcuts', '../techfoliodesigner/src/help/Shortcuts.md'),
    },
  ];

  // const helpSubMenu = [
  //   {
  //     label: 'Getting Started',
  //     click: () => dialog.showMessageBox({
  //       message:
  //               'Welcome to Techfolio Designer!\n\n' +
  //               '1) To get started, login to GitHub using the Config menu. ' +
  //               'From here, set the Github repo name of your Techfolio, which will look like this: "(MyGitHubUsername).github.io".\n' + // eslint-disable-line
  //               '2) Go to "Clone Repo into Directory" in the Config menu, and select the folder ' +
  //               'where you would like to copy your online Techfolio to your computer for local editing.\n' +
  //               '3) Once you\'re done editing your techfolio, it\'s time to put it up online. ' +
  //               'Simply click "Push Changes to GitHub" in the Config menu.\n' +
  //               "4) Now you're ready to go! Check out our other Help Menu options for more information.",
  //     }),
  //   },
  //   {
  //     label: 'Splash Page',
  //     click: () => dialog.showMessageBox({
  //       message:
  //               'The Splash Page has three parts to it: Splash Table, Command Logs, and File Manager.\n' +
  //               'The Splash Table on the left consists of five rows, which tell you the status of your Techfolio.\n' +
  //               'The Command Logs below it will show you a log of everything Techfolio Designer does.\n' + // eslint-disable-line
  //               'The File Manager on the right allows you to manage both your projects and essays.',
  //     }),
  //   },
  //       // todo Projects/essays and image creation. Our design is not finalized as of yet
  //   {
  //     label: 'Editing Projects and Essays',
  //     click: () => dialog.showMessageBox({
  //       message:
  //               'todo accessing text editor\n\n' +
  //               'Once you have created/opened your file for editing, you can write it using Techfolio\'s own text editor.\n' + // eslint-disable-line
  //               'Techfolio Designer comes with it\'s own TfLint technology, which parses your file for common mistakes most users make.' + // eslint-disable-line
  //               'TfLint will run when your file is saved (Ctrl/Cmd + S), or by using the keybinding (Ctrl/Cmd + L).',
  //     }),
  //   },
  //   {
  //     label: 'Adding Images.md',
  //     click: () => dialog.showMessageBox({
  //       message: 'todo',
  //
  //     }),
  //   },
  //   {
  //     type: 'separator',
  //   },
  //   {
  //     label: 'Shortcuts',
  //     click: () => dialog.showMessageBox({
  //       message:
  //               'Text Editor\n' +
  //               'Ctrl/Cmd + S: Save\n' +
  //               'Ctrl/Cmd + L: Run TfLint Essay Checking',
  //     }),
  //   },
  // ];
  return helpSubMenu;
}
