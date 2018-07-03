import { _ } from 'underscore';
/**
 * In Electron, there must be a global reference to a BrowserWindow instance in order to prevent it from
 * being garbage collected.  Similarly, once a window is closed by the user, any global reference should be
 * removed in order to allow the BrowserWindow object to be garbage collected.
 *
 * TechFolio Designer involves multiple browser windows and the purpose of this class is to create and delete
 * these global references.
 *
 * One instance of this class is attached to the app object.
 */
class TechFolioWindowManager {
  /**
   * Initialize this class with the path to the TechFolio files for this user.
   * @param directory The directory containing TechFolio files.
   */
  constructor() {
    this.windows = {};
  }

  addWindow(path, window) {
    this.windows[path] = window;
  }

  removeWindow(path) {
    this.windows[path] = null;
  }

  getWindow(path) {
    return this.windows[path];
  }

  noWindows() {
    return _.isEmpty(this.windows);
  }
}

const techFolioWindowManager = new TechFolioWindowManager();

export default techFolioWindowManager;
