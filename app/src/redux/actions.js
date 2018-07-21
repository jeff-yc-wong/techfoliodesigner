import techFolioGitHubManager from '../shared/TechFolioGitHubManager';

export function setUsername(username) {
  techFolioGitHubManager.set('username', username);
  return { type: 'SET_USERNAME', payload: username };
}

export function setRepo(repo) {
  techFolioGitHubManager.set('repo', repo);
  return { type: 'SET_REPO', payload: repo };
}

export function setDirectory(dir) {
  techFolioGitHubManager.set('dir', dir);
  return { type: 'SET_DIR', payload: dir };
}

export function setToken(token) {
  techFolioGitHubManager.set('token', token);
  return { type: 'SET_TOKEN', payload: token };
}

export function setAuthenticated(authenticated) {
  return { type: 'SET_AUTHENTICATED', payload: authenticated };
}

export function setStatus(status) {
  return { type: 'SET_STATUS', payload: status };
}

export function addLog(log) {
  return { type: 'ADD_LOG', payload: log };
}

export function clearAll() {
  techFolioGitHubManager.clearAll();
  return { type: 'CLEAR_ALL', payload: null };
}
