import electron, { dialog } from 'electron';
import buildMainMenu from './MainMenu';

const app = electron.app;

/* eslint no-param-reassign: 0 */

function setDirectory() {
  dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => {
    if (files) {
      const directory = files[0];
      app.techFolioWindowManager.setDirectory(directory);
      buildMainMenu(); //eslint-disable-line
    }
  });
}

function gitHubLogin() {
  console.log('login to Github');
}

function specifyRemoteRepo() {
  console.log('specify remote repo.');
}

function cloneOrPull() {
  console.log('cloneOrPull');
}

function push() {
  console.log('push');
}


function buildAuthenticationSubMenu() {
  return { label: 'Authentication', submenu: [{ label: 'Login to GitHub', click: gitHubLogin }] };
}

function buildRemoteRepoSubMenu() {
  return { label: 'Remote Repo', submenu: [{ label: 'Specify remote repo', click: specifyRemoteRepo }] };
}

function buildLocalDirSubMenu() {
  return { label: 'Local Dir', submenu: [{ label: 'Specify local directory', click: setDirectory }] };
}

function buildClonePullSubMenu() {
  return { label: 'Clone/Pull', submenu: [{ label: 'Clone or Pull', click: cloneOrPull }] };
}

function buildPushMenu() {
  return { label: 'Push', submenu: [{ label: 'Push', click: push }] };
}

export default function buildConfigSubMenu() {
  const configSubMenu = [
    buildAuthenticationSubMenu(),
    buildRemoteRepoSubMenu(),
    buildLocalDirSubMenu(),
    buildClonePullSubMenu(),
    buildPushMenu(),
  ];
  return configSubMenu;
}
