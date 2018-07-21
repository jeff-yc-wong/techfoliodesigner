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

function unsetLocalDirectory() {
  mainStore.dispatch(action.setDirectory(null));
  buildMainMenu();
}

function logoutFromGitHub() {
  mainStore.dispatch(action.clearAll());
  buildMainMenu();
}

async function specifyRemoteRepo() {
  const username = mainStore.getState().username || 'username';
  try {
    const repoName = await prompt({
      title: 'Specify the remote repo name',
      label: 'Repo name:',
      value: `${username}.github.io`,
      inputAttrs: { type: 'text', required: 'true' },
    });
    mainStore.dispatch(action.setRepo(repoName));
    buildMainMenu();
  } catch (e) {
    console.log('error in specifyRemoteRepo dialog', e);
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

function gitStatus() {
  runLocalDirStatus();
}

function gitReset() {
  runResetLocalDir();
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
  const remoteRepoName = mainStore.getState().repo || 'No remote repo specified.';
  const firstItem = { label: remoteRepoName, enabled: false };
  const secondItem = { label: 'Specify remote repo', click: specifyRemoteRepo };
  return { label: 'Remote Repo', submenu: [firstItem, secondItem] };
}

function buildLocalDirSubMenu() {
  const currDir = mainStore.getState().dir;
  const firstItem = { label: currDir || 'No local directory specified', enabled: false };
  const secondItem = currDir ?
    { label: 'Unset local directory', click: unsetLocalDirectory } :
    { label: 'Set local directory', click: setLocalDirectory };
  return { label: 'Local Dir', submenu: [firstItem, secondItem] };
}

function buildCloneSubMenu() {
  const enabled = !!mainStore.getState().username;
  return { label: 'Clone', submenu: [{ label: 'Download repo to new local directory', click: clone, enabled }] };
}

function buildPushMenu() {
  return { label: 'Push', submenu: [{ label: 'Upload local changes to GitHub', click: push }] };
}

function buildRebuildMenus() {
  return { label: 'Rebuild Menus', click: () => buildMainMenu() };
}

function buildStatusMenu() {
  return { label: 'Status', submenu: [{ label: 'Check for changes in local directory', click: gitStatus }] };
}

function buildResetMenu() {
  return { label: 'Reset', submenu: [{ label: 'Revert local directory (delete unpushed changes!)', click: gitReset }] };
}

function buildPullMenu() {
  return { label: 'Pull', submenu: [{ label: 'Download and merge changes (if any) from GitHub repo', click: pull }] };
}

export default function buildConfigSubMenu() {
  const configSubMenu = [
    buildAuthenticationSubMenu(),
    buildRemoteRepoSubMenu(),
    buildLocalDirSubMenu(),
    buildCloneSubMenu(),
    buildPushMenu(),
    buildStatusMenu(),
    buildPullMenu(),
    buildResetMenu(),
    buildRebuildMenus(),
  ];
  return configSubMenu;
}
