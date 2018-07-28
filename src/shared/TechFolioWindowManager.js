import { _ } from 'underscore';

/**
 * TechFolioWindowManager makes sure there is a global reference for all open BrowserWindow instances, which is
 * an Electron requirement.
 *
 * In addition, it keeps a x and y offset value that prevents new windows from opening on top of old ones.
 *
 * The singleton techFolioWindowManager instance exists only in the main process.
 */
class TechFolioWindowManager {
  constructor() {
    this.xOffset = 0;
    this.yOffset = 0;
    this.beforeQuit = false;
    this.splashWindow = null;
    this.projects = [];
    this.essays = [];
    this._data = []; //eslint-disable-line
  }

  getXOffset() {
    this.xOffset += 25;
    return this.xOffset;
  }

  getYOffset() {
    this.yOffset += 25;
    return this.yOffset;
  }

  setBeforeQuit() {
    this.beforeQuit = true;
  }

  addWindow(fileType, fileName, window) {
    // Create a global reference to the window.
    const fileWindowPairs = this[fileType];
    const pair = { fileName, window };
    fileWindowPairs.push(pair);
  }

  removeWindow(fileType, fileName) {
    if (!this.beforeQuit) {
      // Remove the global reference so the window can be garbage collected.
      const fileWindowPairs = this[fileType];
      this[fileType] = _.reject(fileWindowPairs, pair => pair.fileName === fileName);
    }
  }

  getWindow(fileType, fileName) {
    const fileNameWindowPairs = this[fileType];
    const pair = _.find(fileNameWindowPairs, obj => obj.fileName === fileName);
    return pair && pair.window;
  }

  noWindows() {
    return _.isEmpty(this.projects) && _.isEmpty(this.essays) && !this.splashWindow;
  }

  setSplashWindow(splashWindow) {
    this.splashWindow = splashWindow;
  }

  clearSplashWindow() {
    this.splashWindow = null;
  }
}

const techFolioWindowManager = new TechFolioWindowManager();

export default techFolioWindowManager;
