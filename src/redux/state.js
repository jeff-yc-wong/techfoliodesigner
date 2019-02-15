/** @module ReduxState */

import techFolioGitHubManager from '../shared/TechFolioGitHubManager';

/**
 * Initial state of the Redux store.
 * @type {{authenticated: boolean, username: null, repo: null, dir: null, status: null, token: null, logs: Array}}
 */
export const emptyState = {
  authenticated: false,
  username: null,
  repo: null,
  dir: null,
  status: null,
  token: null,
  logs: [],
};

export function initialState() {
  return Object.assign({}, emptyState, techFolioGitHubManager.getSavedState());
}

