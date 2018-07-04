import { _ } from 'underscore';
import Store from 'electron-store';

/**
 * TechFolioWindowManager accomplishes two tasks: global references and persistence.
 *
 * First, in Electron, there must be a global reference to a BrowserWindow instance in order to prevent it from
 * being garbage collected.  Similarly, once a window is closed by the user, any global reference should be
 * removed in order to allow the BrowserWindow object to be garbage collected. So, this class makes sure there
 * is a global reference and also allows the reference to be deleted.
 *
 * Second, the current directory and paths corresponding to the open windows is persisted to a local store.
 * This enables the open windows to be restored upon startup.
 *
 * The techFolioManager object is attached to the app object at system startup time.
 */
class TechFolioWindowManager {
  constructor() {
    this.beforeQuit = false;
    this.projects = [];
    this.essays = [];
    this.store = new Store({ name: 'TechFolioWindowManager', defaults: { projects: [], essays: [], directory: '' } });
    console.log('recovered essays', this.store.get('essays'));
  }

  setDirectory(directory) {
    // TODO: should this clear existing windows?
    this.store.set('directory', directory);
  }

  setBeforeQuit() {
    this.beforeQuit = true;
  }

  addWindow(fileType, fileName, window) {
    // Create a global reference to the window.
    const fileWindowPairs = this[fileType];
    const pair = { fileName, window };
    fileWindowPairs.push(pair);
    // Store the fact that fileName is associated with an open window, unless it is already.
    const fileNames = this.store.get(fileType);
    if (!_.find(fileNames, theName => theName === fileName)) {
      fileNames.push(fileName);
      console.log('about to store', fileType, fileNames);
      this.store.set(fileType, fileNames);
    }
  }

  removeWindow(fileType, fileName) {
    if (!this.beforeQuit) {
      // Remove the global reference so the window can be garbage collected.
      const fileWindowPairs = this[fileType];
      this[fileType] = _.reject(fileWindowPairs, pair => pair.fileName === fileName);
      // Remove the stored reference to fileName as being associated with an open window.
      const fileNames = this.store.get(fileType);
      this.store.set(fileType, _.reject(fileNames, theName => theName === fileName));
    }
  }

  getWindow(fileType, fileName) {
    const fileNameWindowPairs = this[fileType];
    return _.find(fileNameWindowPairs, obj => obj.fileName === fileName);
  }

  getFileNames(fileType) {
    return this.store.get(fileType);
  }

  getDirectory() {
    return this.store.get('directory');
  }

  noWindows() {
    return _.isEmpty(this.projects) && _.isEmpty(this.essays);
  }
}

const techFolioWindowManager = new TechFolioWindowManager();

export default techFolioWindowManager;
