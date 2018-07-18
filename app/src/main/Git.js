import electron from 'electron';
import path from 'path';
import moment from 'moment';

const git = require('simple-git/promise');

const app = electron.app;
const wManager = app.techFolioWindowManager;

export function cloneRepo(directory) {
  const gManager = app.techFolioGitHubManager;
  gManager.addLog(`Clone: starting clone into ${directory}`);
  const user = gManager.get('username');
  const token = gManager.get('token');
  const repo = gManager.get('repo');
  const newDir = path.join(directory, repo);
  const remote = `https://${token}@github.com/${user}/${repo}.git`;
  git(directory).silent(true)
    .clone(remote)
    .then(() => { wManager.setDirectory(newDir); gManager.addLog('Clone: finished.'); })
    .catch(err => gManager.addLog(`Clone: failed: ${err}`));
}

function processStatusResult(result) {
  const gManager = app.techFolioGitHubManager;
  let statusString = '';
  if (result.not_added.length > 0) {
    statusString += `New: ${result.not_added}, `;
  }
  if (result.conflicted.length > 0) {
    statusString += `Conflicted: ${result.conflicted}, `;
  }
  if (result.deleted.length > 0) {
    statusString += `Deleted: ${result.deleted}, `;
  }
  if (result.modified.length > 0) {
    statusString += `Modified: ${result.modified}, `;
  }
  if (!statusString) {
    statusString = 'No changes to local directory';
  }
  statusString = `${moment().format('h:mm a')}: ${statusString}`;
  gManager.set('status', statusString);
  gManager.addLog('Status: finished.');
}

export function localDirStatus() {
  const gManager = app.techFolioGitHubManager;
  const directory = app.techFolioWindowManager.getDirectory();
  gManager.addLog(`Status: starting status for ${directory}`);
  git(directory).status()
    .then(result => processStatusResult(result))
    .catch(err => gManager.addLog(`Status: failed: ${err}`));
}
