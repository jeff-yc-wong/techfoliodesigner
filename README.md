TechFolio Designer is a desktop app written using [Electron](http://electron.atom.io/) to simplify the development of professional portfolios using TechFolios.

## Developer Guide

* Install a recent version of [NodeJS](https://nodejs.org/en/) (10.5 or above).
* Install [electron forge](https://electronforge.io/).
* cd into the app directory:
    * `npm install`
    * `electron-forge run`

## Current user problems that Designer should help solve:

* Removing the "sample" projects and essays should be easier.
* It should be impossible to commit a project or essay date that is not in YYYY-MM-DD format.
* Prohibit file names containing spaces.
* Easier understanding of how to rename the URL to retrieve a project or essay.
* Easier use of markdown.  Prevent problems like `##Title` that do not display correctly when formatted.
* Spell checking of essay and project text.
* Simplify creation of square images for use in project and home pages.

## Package explanations

Useful:

* electron-prebuilt-compile: Support for React, Less, ES7.
* front-matter: Parse YAML
* fs-extra: drop-in replacement for fs; provides async/await support
* jimp: image processing library
* marked: parses markdown into HTML
* nodegit: git commands in node
* octonode: github authentication and manipulation
* react-datepicker: datepicker
* electron-oauth-github: (Not currently used) electron module for authenticating your Electron app with GitHub.

Questionable:

* html-react-parser: converts an HTML string to a React element.
* html-tidy2: clean up poorly formatted HTML 
* superagent: HTTP GET, PUT, etc.


## Other resources

* [GitHub Authentication for Electron](https://medium.com/linagora-engineering/using-oauth-in-an-electron-application-abb0376c2ae0)

## Code notes

* secret.js needs to be dealt with somehow.

