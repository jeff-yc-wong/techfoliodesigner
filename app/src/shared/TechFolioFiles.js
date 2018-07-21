import { _ } from 'underscore';
import isDirectory from 'is-directory';
import path from 'path';

const fs = require('fs');

class TechFolioFiles {
  /**
   * Initialize this class with the path to the TechFolio files for this user.
   * @param directory The directory containing TechFolio files.
   */
  constructor(directory) {
    this.directory = directory;
  }

  /**
   * Validate that the chosen TechFolio directory is in fact a TechFolio directory.
   * @returns False if it's a TechFolio directory, a string indicating the problem if not.
   */
  isInvalidDirectory() {
    if (!isDirectory.sync(this.directory)) {
      return `${this.directory} is not a valid directory`;
    }
    const projectsDir = path.join(this.directory, 'projects');
    if (!fs.existsSync(projectsDir)) {
      return `${projectsDir} does not exist, so not a Techfolio directory.`;
    }
    const essaysDir = path.join(this.directory, 'essays');
    if (!fs.existsSync(essaysDir)) {
      return `${essaysDir} does not exist, so not a Techfolio directory.`;
    }
    const gitDir = path.join(this.directory, '.git');
    if (!fs.existsSync(gitDir)) {
      return `${gitDir} does not exist, so this directory is not under git control.`;
    }
    return false;
  }

  fileNames(fileType) {
    return _.filter(fs.readdirSync(path.join(this.directory, fileType)), fileName => fileName.endsWith('.md'));
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

  bioJsonFile() {
    return fs.readdirSync(path.join(this.directory, '_data', 'bio.json'));
  }

  writeFile(fileType, fileName, contents, successCallback) {
    const filePath = path.join(this.directory, fileType, fileName);
    fs.writeFile(filePath, contents, 'utf8', (err) => {
      if (err) throw err;
      console.log(`${filePath} written.`); // eslint-disable-line
      successCallback();
    });
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
