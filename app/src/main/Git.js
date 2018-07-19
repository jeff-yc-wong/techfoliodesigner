import electron from 'electron';
import path from 'path';
import moment from 'moment';
import buildMainMenu from './MainMenu';

const git = require('simple-git/promise');

const app = electron.app;

export function runCloneRepo(directory) {
  const gManager = app.techFolioGitHubManager;
  const wManager = app.techFolioWindowManager;
  gManager.addLog(`Clone: downloading ${gManager.get('repo')} into ${directory}`);
  const user = gManager.get('username');
  const token = gManager.get('token');
  const repo = gManager.get('repo');
  const newDir = path.join(directory, repo);
  const remote = `https://${token}@github.com/${user}/${repo}.git`;
  git(directory).silent(true)
    .clone(remote)
    .then(() => { wManager.setDirectory(newDir); gManager.addLog('Clone: finished'); })
    .catch(err => gManager.addLog(`Clone: failed: ${err}`));
}

function processStatusResult(result) {
  const gManager = app.techFolioGitHubManager;
  let statusString = '';
  ['created', 'modified', 'deleted', 'conflicted'].map((state) => {
    if (result[state].length > 0) {
      statusString += `${state}: ${result[state]}`;
    }
  });
  if (!statusString) {
    statusString = 'No changes to local directory';
  }
  statusString = `${moment().format('h:mm:ss a')}: ${statusString}`;
  gManager.set('status', statusString);
  gManager.addLog('Status: finished');
}

export function runLocalDirStatus() {
  const gManager = app.techFolioGitHubManager;
  const directory = app.techFolioWindowManager.getDirectory();
  gManager.addLog(`Status: starting status for ${directory}`);
  git(directory).status()
    .then(result => processStatusResult(result))
    .catch(err => gManager.addLog(`Status: failed: ${err}`));
}

export function runResetLocalDir() {
  const gManager = app.techFolioGitHubManager;
  const directory = app.techFolioWindowManager.getDirectory();
  gManager.addLog(`Reset: starting reset of ${directory}`);
  git(directory).reset('hard')
    .then(() => { gManager.addLog('Reset: finished'); runLocalDirStatus(); buildMainMenu(); })
    .catch(err => gManager.addLog(`Reset: failed: ${err}`));
}

export function runAddFile(filePath) {
  const gManager = app.techFolioGitHubManager;
  const directory = app.techFolioWindowManager.getDirectory();
  gManager.addLog(`Add: adding file ${filePath} to git.`);
  git(directory).add([filePath])
    .then(() => gManager.addLog('Add: finished'))
    .catch(err => gManager.addLog(`Add: failed: ${err}`));
}

function runPushThenStatus() {
  const gManager = app.techFolioGitHubManager;
  const directory = app.techFolioWindowManager.getDirectory();
  gManager.addLog('Push: pushing local dir to GitHub');
  git(directory).push(['origin', 'master'])
    .then((result) => { gManager.addLog(`Push: finished push: ${result}`); runLocalDirStatus(); })
    .catch(err => gManager.addLog(`Push: failed during push: ${err}`));
}

export function runCommitThenPush() {
  const gManager = app.techFolioGitHubManager;
  const directory = app.techFolioWindowManager.getDirectory();
  gManager.addLog('Push: committing local changes');
  git(directory).commit(['-a', '-m ', 'Commit by TechFolio Designer'])
    .then((result) => { gManager.addLog(`Push: finished commit: ${result}`); runPushThenStatus(); })
    .catch(err => gManager.addLog(`Commit: failed: ${err}`));
}

export function runPull() {
  const gManager = app.techFolioGitHubManager;
  const directory = app.techFolioWindowManager.getDirectory();
  gManager.addLog('Pull: getting changes (if any) from GitHub');
  git(directory).pull()
    .then(() => { gManager.addLog('Pull: finished'); runLocalDirStatus(); })
    .catch(err => gManager.addLog(`Pull: failed: ${err}`));
}
