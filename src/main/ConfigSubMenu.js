import { dialog } from 'electron';
import prompt from 'electron-prompt';
import buildMainMenu from './MainMenu';
import runLoginToGitHub from './GitHub';
import { runCloneRepo, runLocalDirStatus, runResetLocalDir, runAddThenCommitThenPush, runPull } from './Git';
import * as action from '../redux/actions';
import mainStore from '../redux/mainstore';

/* eslint no-param-reassign: 0 */

function setLocalDirectory() {
  dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => {
    if (files) {
      const directory = files[0];
      mainStore.dispatch(action.setDirectory(directory));
      buildMainMenu();
    }
  });
}

function logoutFromGitHub() {
  mainStore.dispatch(action.setAuthenticated(false));
  buildMainMenu();
}

function clearAll() {
  mainStore.dispatch(action.clearAll());
  buildMainMenu();
}

async function setRemoteRepo() {
  const username = mainStore.getState().username || 'username';
  try {
    const repoName = await prompt({
      title: 'Specify the remote TechFolio repo name',
      label: 'TechFolio Repo Name:',
      value: `${username}.github.io`,
      inputAttrs: { type: 'text', required: 'true' },
    });
    if (repoName) {
      mainStore.dispatch(action.setRepo(repoName));
      buildMainMenu();
    }
  } catch (e) {
    mainStore.dispatch(action.addLog(`Error in setRemoteRepo dialog: ${e}`));
  }
}

async function clone() {
  dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => {
    if (files) {
      const directory = files[0];
      mainStore.dispatch(action.addLog(`Clone directory specified as: ${directory}`));
      runCloneRepo(directory);
    }
  });
}

function push() {
  runAddThenCommitThenPush();
}


function gitReset() {
  const options = {
    type: 'warning',
    title: 'Do you really want to reset your local directory?',
    message: 'You will lose any changes not pushed to GitHub!',
    defaultId: 0,
    buttons: ['Cancel', 'Yes, lose my changes'],
  };
  dialog.showMessageBox(options, (index) => {
    if (index === 1) {
      runResetLocalDir();
    }
  });
}

function pull() {
  runPull();
}


function buildAuthenticationSubMenu() {
  const authenticatedMenu = { label: 'Logout from GitHub', click: logoutFromGitHub };
  const notAuthenticatedMenu = { label: 'Login to GitHub', click: runLoginToGitHub };
  return mainStore.getState().authenticated ? authenticatedMenu : notAuthenticatedMenu;
}

function buildRemoteRepoSubMenu() {
  const enabled = !!mainStore.getState().authenticated;
  return { label: 'Set GitHub repo name', click: setRemoteRepo, enabled };
}

function buildCloneSubMenu() {
  const enabled = mainStore.getState().authenticated;
  return { label: 'Clone repo into directory', click: clone, enabled };
}

function buildPushMenu() {
  const enabled = mainStore.getState().authenticated;
  return { label: 'Push changes to GitHub', click: push, enabled };
}

function buildStatusMenu() {
  const enabled = mainStore.getState().dir;
  return { label: 'Check local directory status', click: runLocalDirStatus, enabled };
}

function buildAdvancedMenu() {
  const enabled = mainStore.getState().authenticated;
  const item1 = { label: 'Reset local directory contents', click: gitReset, enabled };
  const item2 = { label: 'Set local directory', click: setLocalDirectory, enabled };
  const item3 = { label: 'Pull changes from GitHub repo', click: pull, enabled };
  const item4 = { label: 'Rebuild Menus', click: () => buildMainMenu() };
  const item5 = { label: 'Clear settings', click: () => clearAll() };
  return { label: 'Advanced', submenu: [item1, item2, item3, item4, item5] };
}

export default function buildConfigSubMenu() {
  const configSubMenu = [
    buildAuthenticationSubMenu(),
    buildRemoteRepoSubMenu(),
    buildCloneSubMenu(),
    buildPushMenu(),
    buildStatusMenu(),
    buildAdvancedMenu(),
  ];
  return configSubMenu;
}
