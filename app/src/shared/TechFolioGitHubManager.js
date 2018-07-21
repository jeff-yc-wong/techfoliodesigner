import Store from 'electron-store';

/**
 * TechFolioGitHubManager provides persistent access to the following GitHub-related variables:
 *   * GitHub OAuth token
 *   * GitHub username
 *   * GitHub remote repo name.
 *   * Local directory containing a GitHub repo.
 *     This is usually, but does not have to be, a clone of the GitHub remote rep.
 *
 * This class is used as follows:
 *   * Upon system startup, the stored values are read using the get methods and used to initialize the Redux store.
 *   * During system execution, the redux store maintains the current values.  Any time a value is updated in the
 *   Redux store, this class instance's set methods are called to ensure the latest value is persisted.
 *   * After system startup, the get methods are never used.
 */
class TechFolioGitHubManager {
  constructor() {
    this.store = new Store({ name: 'TechFolioGitHubManager',
      defaults: { token: null, username: null, repo: null, dir: null } });
  }

  /**
   * Set property to value.
   * @param property Should be one of 'token', 'username', or 'repo'.
   * @param value The value to be associated with the property.
   */
  set(property, value) {
    this.store.set(property, value);
  }

  /**
   * Return an object containing the current values of all the stored properties (token, username, repo, dir).
   */
  getSavedState() {
    return Object.assign({}, this.store.store);
  }

  /**
   * Clears the property value.
   * @param property One of 'token', 'username', 'dir', or 'repo'.
   */
  clear(property) {
    this.store.set(property, null);
  }

  clearAll() {
    ['token', 'username', 'repo', 'dir'].map(field => this.clear(field));
  }
}

const techFolioGitHubManager = new TechFolioGitHubManager();

export default techFolioGitHubManager;
