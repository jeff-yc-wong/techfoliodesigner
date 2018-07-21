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
  mainStore.dispatch(action.clearAll());
  buildMainMenu();
}

async function setRemoteRepo() {
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
  return { label: 'Set remote repo', click: setRemoteRepo };
}

function buildLocalDirSubMenu() {
  return { label: 'Set local directory', click: setLocalDirectory };
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
  return { label: 'Check local directory status', click: runLocalDirStatus };
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
