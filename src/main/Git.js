import path from 'path';
import moment from 'moment';
import * as action from '../redux/actions';
import mainStore from '../redux/mainstore';
import buildMainMenu from './MainMenu';

const git = require('simple-git/promise');

function getRepoURL() {
  const user = mainStore.getState().username;
  const token = mainStore.getState().token;
  const repo = mainStore.getState().repo;
  return `https://${token}@github.com/${user}/${repo}.git`;
}

export function runCloneRepo(directory) {
  const repo = mainStore.getState().repo;
  const newDir = path.join(directory, repo);
  mainStore.dispatch(action.addLog(`Starting download of ${repo} into ${directory}. This may take up to 60 seconds...`)); // eslint-disable-line
  const remote = getRepoURL();
  git(directory).silent(true)
    .clone(remote)
    .then(() => {
      mainStore.dispatch(action.setDirectory(newDir));
      mainStore.dispatch(action.addLog(`Finished download of ${repo} into ${directory}.`));
    })
    .catch(err => mainStore.dispatch(action.addLog(`Finished download with error: ${err}`)));
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
  mainStore.dispatch(action.setStatus(statusString));
  mainStore.dispatch(action.addLog('Finished status request.'));
}

export function runLocalDirStatus() {
  const directory = mainStore.getState().dir;
  mainStore.dispatch(action.addLog(`Starting status request for ${directory}...`));
  git(directory).status()
    .then(result => processStatusResult(result))
    .catch(err => mainStore.dispatch(action.addLog(`Finished status request with error: ${err}`)));
}

export function runResetLocalDir() {
  const directory = mainStore.getState().dir;
  mainStore.dispatch(action.addLog(`Starting reset of ${directory}...`));
  git(directory).reset('hard')
    .then(() => { mainStore.dispatch(action.addLog('Finished reset.')); runLocalDirStatus(); buildMainMenu(); })
    .catch(err => mainStore.dispatch(action.addLog(`Finished reset with error: ${err}`)));
}

export function runAddFile(filePath) {
  const directory = mainStore.getState().dir;
  mainStore.dispatch(action.addLog(`Starting add of file ${filePath} to git...`));
  git(directory).add([filePath])
    .then(() => mainStore.dispatch(action.addLog(`Finished add of file ${filePath}`)))
    .catch(err => mainStore.dispatch(action.addLog(`Finished add with failure: ${err}`)));
}

function runPushThenStatus() {
  const directory = mainStore.getState().dir;
  mainStore.dispatch(action.addLog('Starting push of local dir to GitHub...'));
  git(directory).push([getRepoURL(), 'master'])
    .then(result => mainStore.dispatch(action.addLog(`Finished push. ${result}`)));
}

function runCommitThenPush() {
  const directory = mainStore.getState().dir;
  mainStore.dispatch(action.addLog('Starting commit of local changes...'));
  git(directory).commit('Commit by TechFolio Designer', { '--all': null })
    .then(() => { mainStore.dispatch(action.addLog('Finished commit')); runPushThenStatus(); })
    .catch(err => mainStore.dispatch(action.addLog(`Finished commit with error: ${err}`)));
}

export function runAddThenCommitThenPush() {
  const directory = mainStore.getState().dir;
  mainStore.dispatch(action.addLog('Starting add of all local changes...'));
  git(directory).raw(['add', '--all'])
    .then(() => { mainStore.dispatch(action.addLog('Finished add of all local changes')); runCommitThenPush(); })
    .catch(err => mainStore.dispatch(action.addLog(`Finish add with error: ${err}`)));
}

export function runPull() {
  const directory = mainStore.getState().dir;
  mainStore.dispatch(action.addLog('Starting pull of updates (if any) from GitHub'));
  git(directory).pull(getRepoURL())
    .then(() => { mainStore.dispatch(action.addLog('Finished pull of updates.')); runLocalDirStatus(); })
    .catch(err => mainStore.dispatch(action.addLog(`Finished pull with error: ${err}`)));
}
