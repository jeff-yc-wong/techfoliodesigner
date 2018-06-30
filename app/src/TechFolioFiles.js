import { _ } from 'underscore';

const path = require('path');
const fs = require('fs-extra');

class TechFolioFiles {
  /**
   * Initialize this class with the path to the TechFolio files for this user.
   * @param directory The directory containing TechFolio files.
   */
  constructor(directory) {
    this.directory = directory;
  }

  /**
   * @returns An array of all .md files in the essays/ directory.
   */
  essayFileNames() {
    return _.filter(fs.readdirSync(path.join(this.directory, 'essays')), fileName => fileName.endsWith('.md'));
  }

  /**
   * @returns An array of all .md files in the projects/ directory.
   */
  projectFileNames() {
    return _.filter(fs.readdirSync(path.join(this.directory, 'projects')), fileName => fileName.endsWith('.md'));
  }

  /**
   * Returns the text of the file in the associated directory.
   * @param dir The directory (typically "_data", "essays", or "projects")
   * @param fileName The file name
   * @returns {String} The contents of the file.
   */
  fileText(dir, fileName) {
    return fs.readFileSync(path.join(this.directory, dir, fileName), 'utf8');
  }
}

export default TechFolioFiles;
