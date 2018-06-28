TechFolio Designer is a desktop app written using [Electron](http://electron.atom.io/) to simplify the development of professional portfolios using TechFolios.

## Version 1.0: Local editor

Version 1.0 is simply a "Techfolio-aware" text editor.  It is the responsibility of the user to clone the techfolio repository from GitHub, and push local changes back to GitHub. 

Basic design:

* App menu has Settings, Bio, Projects, and Essays.
* Settings menu allows the user to specify the directory containing the Techfolio.
* Once specified, directory is parsed and Projects and Essays menus are populated with current file names.
* Menus also have an "New Project" and "New Essay" item for creating a new file.

Selecting a file or Bio section presents the data. 

Issues: 
* how to delete a project or essay?
* what to do when YAML can't be parsed?
* what to do with merge conflicted files?  

## Version 2.0: GitHub management

Version 2.00 adds support for GitHub.

* The user can tell Designer their GitHub username and the name of the remote repo.
* The user can authenticate against GitHub.
* The user can pull and push changes. 
* Merge conflicts must be dealt with somehow. 
* It would be good to indicate when the remote repo is out of sync with the local files (such as when the user is using two computers to edit their portfolio).

## Version 3.0: Image management

This version adds support for image management:

* Image cropping.
* Image compression.
 
## Current user problems that Designer should help solve:

* Removing the "sample" projects and essays should be easier.
* It should be impossible to commit a project or essay date that is not in YYYY-MM-DD format.
* No file names containing spaces.
* Easier understanding of how to rename the URL to retrieve a project or essay.
* Easier use of markdown.  Prevent problems like `##Title` that do not display correctly when formatted.
* Spell checking of essay and project text.
* Uploading of non-square images for using in project page or home page image.


