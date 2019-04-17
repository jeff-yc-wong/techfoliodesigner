import techFolioWindowManager from '../shared/TechFolioWindowManager';

const marked = require('marked');
const fs = require('fs');
const { BrowserWindow } = require('electron');
const path = require('path');

function showHelpDialog(label, markdownPath) {
  const markdownText = fs.readFileSync(markdownPath, 'utf-8');
  const htmlText = marked(markdownText);

  let finalHtml = fs.readFileSync('../techfoliodesigner/src/help/BaseHelp.html', 'utf-8');
  finalHtml = finalHtml.replace('<placeholder></placeholder>', htmlText);
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
      label: 'TF Lint',
      click: () => showHelpDialog('TfLint', '../techfoliodesigner/src/help/TfLint.md'),
    },
    {
      label: 'Spell Checker',
      click: () => showHelpDialog('Spell Checker', '../techfoliodesigner/src/help/SpellChecker.md'),
    },
    {
      type: 'separator',
    },
    {
      label: 'Shortcuts',
      click: () => showHelpDialog('Shortcuts', '../techfoliodesigner/src/help/Shortcuts.md'),
    },
  ];

  return helpSubMenu;
}
