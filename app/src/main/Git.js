import electron from 'electron';
import path from 'path';

const git = require('simple-git/promise');

const app = electron.app;

export function cloneRepo(directory) { //eslint-disable-line
  const gmanager = app.techFolioGitHubManager;
  const user = gmanager.get('username');
  const token = gmanager.get('token');
  const repo = gmanager.get('repo');
  const newDir = path.join(directory, repo);
  const remote = `https://${token}@github.com/${user}/${repo}.git`;
  git(directory).silent(true)
    .clone(remote)
    .then(() => { app.techFolioWindowManager.setDirectory(newDir); gmanager.addLog('Clone finished.'); })
    .catch(err => gmanager.addLog(`Clone failed: ${err}`));
}
