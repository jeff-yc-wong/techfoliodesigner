import path from 'path';
import moment from 'moment';
import * as action from '../redux/actions';
import mainStore from '../redux/mainstore';
import buildMainMenu from './MainMenu';

const git = require('simple-git/promise');

export function runCloneRepo(directory) {
  const user = mainStore.getState().username;
  const token = mainStore.getState().token;
  const repo = mainStore.getState().repo;
  const newDir = path.join(directory, repo);
  action.addLog(`Clone: downloading ${repo} into ${directory}`);
  const remote = `https://${token}@github.com/${user}/${repo}.git`;
  git(directory).silent(true)
    .clone(remote)
    .then(() => { action.setDirectory(newDir); action.addLog('Clone: finished'); })
    .catch(err => action.addLog(`Clone: failed: ${err}`));
}

function processStatusResult(result) {
  let statusString = '';
  ['created', 'modified', 'deleted', 'conflicted'].forEach((state) => {
    if (result[state].length > 0) {
      statusString += `${state}: ${result[state]}`;
    }
  });
  if (!statusString) {
    statusString = 'No changes to local directory';
  }
  statusString = `${moment().format('h:mm:ss a')}: ${statusString}`;
  action.setStatus('status', statusString);
  action.addLog('Status: finished');
}

export function runLocalDirStatus() {
  const directory = mainStore.getState().dir;
  action.addLog(`Status: starting status for ${directory}`);
  git(directory).status()
    .then(result => processStatusResult(result))
    .catch(err => action.addLog(`Status: failed: ${err}`));
}

export function runResetLocalDir() {
  const directory = mainStore.getState().dir;
  action.addLog(`Reset: starting reset of ${directory}`);
  git(directory).reset('hard')
    .then(() => { action.addLog('Reset: finished'); runLocalDirStatus(); buildMainMenu(); })
    .catch(err => action.addLog(`Reset: failed: ${err}`));
}

export function runAddFile(filePath) {
  const directory = mainStore.getState().dir;
  action.addLog(`Add: adding file ${filePath} to git.`);
  git(directory).add([filePath])
    .then(() => action.addLog('Add: finished'))
    .catch(err => action.addLog(`Add: failed: ${err}`));
}

function runPushThenStatus() {
  const directory = mainStore.getState().dir;
  action.addLog('Push: pushing local dir to GitHub');
  git(directory).push(['origin', 'master'])
    .then((result) => { action.addLog(`Push: finished push: ${result}`); runLocalDirStatus(); })
    .catch(err => action.addLog(`Push: failed during push: ${err}`));
}

function runCommitThenPush() {
  const directory = mainStore.getState().dir;
  action.addLog('Push: committing local changes');
  git(directory).commit(['-a', '-m ', 'Commit by TechFolio Designer'])
    .then((result) => { action.addLog(`Push: finished commit: ${result}`); runPushThenStatus(); })
    .catch(err => action.addLog(`Commit: failed: ${err}`));
}

export function runAddThenCommitThenPush() {
  const directory = mainStore.getState().dir;
  action.addLog('Push: adding local changes');
  git(directory).raw(['add', '--all'])
    .then(() => { action.addLog('Push: finished add'); runCommitThenPush(); })
    .catch(err => action.addLog(`Commit: add failed: ${err}`));
}

export function runPull() {
  const directory = mainStore.getState().dir;
  action.addLog('Pull: getting changes (if any) from GitHub');
  git(directory).pull()
    .then(() => { action.addLog('Pull: finished'); runLocalDirStatus(); })
    .catch(err => action.addLog(`Pull: failed: ${err}`));
}
