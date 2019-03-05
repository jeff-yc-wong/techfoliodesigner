import techFolioGitHubManager from '../shared/TechFolioGitHubManager';

export const emptyState = {
  authenticated: false,
  username: null,
  repo: null,
  dir: null,
  status: null,
  token: null,
  logs: [],
  fileData: [],
  changed: false,
};

export function initialState() {
  return Object.assign({}, emptyState, techFolioGitHubManager.getSavedState());
}

