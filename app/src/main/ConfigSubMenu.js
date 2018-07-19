import electron, { dialog } from 'electron';
import prompt from 'electron-prompt';
import buildMainMenu from './MainMenu';
import runLoginToGitHub from './GitHub';
import { runCloneRepo, runLocalDirStatus, runResetLocalDir, runAddThenCommitThenPush, runPull } from './Git';

const app = electron.app;

/* eslint no-param-reassign: 0 */

function setLocalDirectory() {
  dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => {
    if (files) {
      const directory = files[0];
      app.techFolioWindowManager.setDirectory(directory);
      buildMainMenu();
    }
  });
}

function unsetLocalDirectory() {
  app.techFolioWindowManager.setDirectory(null);
  buildMainMenu();
}

function logoutFromGitHub() {
  app.techFolioGitHubManager.clearAll();
  buildMainMenu();
}

async function specifyRemoteRepo() {
  const username = app.techFolioGitHubManager.get('username') || 'username';
  try {
    const repoName = await prompt({
      title: 'Specify the remote repo name',
      label: 'Repo name:',
      value: `${username}.github.io`,
      inputAttrs: { type: 'text', required: 'true' },
    });
    app.techFolioGitHubManager.set('repo', repoName);
    buildMainMenu();
  } catch (e) {
    console.log('error in specifyRemoteRepo dialog', e);
  }
}

async function clone() {
  dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => {
    if (files) {
      const directory = files[0];
      app.techFolioGitHubManager.addLog(`Clone directory specified as: ${directory}`);
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
  const token = app.techFolioGitHubManager.get('token');
  const username = token && app.techFolioGitHubManager.get('username');
  const firstItem = { label: username || 'Not authenticated to github', enabled: false };
  const secondItem = username ?
    { label: 'Logout from GitHub', click: logoutFromGitHub } :
    { label: 'Login to GitHub', click: runLoginToGitHub };
  return { label: 'Authentication', submenu: [firstItem, secondItem] };
}

function buildRemoteRepoSubMenu() {
  const remoteRepoName = app.techFolioGitHubManager.get('repo') || 'No remote repo specified.';
  const firstItem = { label: remoteRepoName, enabled: false };
  const secondItem = { label: 'Specify remote repo', click: specifyRemoteRepo };
  return { label: 'Remote Repo', submenu: [firstItem, secondItem] };
}

function buildLocalDirSubMenu() {
  const currDir = app.techFolioWindowManager.getDirectory();
  const firstItem = { label: currDir || 'No local directory specified', enabled: false };
  const secondItem = currDir ?
    { label: 'Unset local directory', click: unsetLocalDirectory } :
    { label: 'Set local directory', click: setLocalDirectory };
  return { label: 'Local Dir', submenu: [firstItem, secondItem] };
}

function buildCloneSubMenu() {
  const enabled = app.techFolioGitHubManager.get('username');
  return { label: 'Clone', submenu: [{ label: 'Download repo to new local directory', click: clone, enabled: !!enabled }] };
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
  return { label: 'Reset', submenu: [{ label: 'Revert local directory (delete all unpushed changes!!)', click: gitReset }] };
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
