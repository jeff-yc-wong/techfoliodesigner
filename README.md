## Motivation

TechFolio Designer is a desktop app written using [Electron](http://electron.atom.io/) to simplify the development of professional portfolios using TechFolios.  

Many of the students who attempt to build their professional portfolio using TechFolio do not have any prior experience with GitHub, Markdown, JSON, or even HTML. Worse, GitHub typically provides no error messages when an incorrectly formatted TechFolio file is committed. Instead, it simply fails to build the site, which means the prior version fails to be updated. This makes it extremely difficult for a beginning TechFolio user to debug the problem. Some of the common problems that students encounter during initial development of their TechFolio include: 

* Committing a bio.json file that is not in legal JSON format.
* Failure to remove the "sample" projects and essays from the template.
* Specifying a project or essay date that is not in YYYY-MM-DD format.
* Creating project or file names containing spaces.
* Incorrect or duplicate permalinks.
* Specifying markdown titles (`##`) without a space between the last `#` and the first character of the title.
* Spelling errors in projects and essays.
* Non-square images associated with project summary and home pages.

These problems are currently difficult to address since, during initial development, students use the browser-based interface to GitHub to create, delete, and edit files.  The goal of TechFolio Designer is to provide a desktop application that is specialized to the needs of TechFolio development, and suitable for use by students with no prior exposure to GitHub, Markdown, JSON and HTML. 

## Workflow

The basic workflow for TechFolio Designer is as follows:

First, the student follows current installation instructions to fork the TechFolio template into their own user account, and make minimal edits using the GitHub browser interface in order to display a "Molly Maluhia" TechFolio in their user account's github.io URL.  

Second, the student downloads a binary release of TechFolio appropriate for their platform (Mac, Windows, Linux). The student runs the application and performs first-time setup: (a) Logging into GitHub, (b) Specifying the repository associated with their TechFolio, and (c) Specifying the local directory in which the files will be cloned. The student then runs a command in TechFolio Designer that clones their TechFolio repo onto their local file system.

Third, the student uses TechFolio Designer to develop their TechFolio. They can:
  * Create, edit, and delete essay and project files using a Markdown-aware editor.
  * Edit their bio.json file using either a JSON-aware editor or a simple form-based interface.
  * Add, delete, and crop image files.
  
These editors should provide spell checking and validation on file front matter (i.e. YAML headers) in order to detect and notify the student of common errors. 

Finally, the student can run a command within TechFolio Designer to push their changes back to GitHub so that the TechFolio can be published and available online.

Note that TechFolio Designer is meant to support the needs of new TechFolio users who are struggling to implement their first TechFolio using standard layouts.  Users who want to do advanced customization, such as the development of an alternative theme, should use a regular IDE such as IntelliJ IDEA for editing. So, TechFolio Designer will only provide access to a subset of the files associated with a TechFolio. 

## Installation

There are currently no platform-specific binary builds of TechFolio Designer. Instead, the system must be built and run in development mode. 

First, install a recent version of [NodeJS](https://nodejs.org/en/) (10.5 or above).

Second, install [electron forge](https://electronforge.io/). (I used `sudo npm install -g electron-forge --allow-root` successfully, but it might be better to use [nvm](https://docs.npmjs.com/getting-started/installing-node#using-a-version-manager-to-install-nodejs-and-npm).)

Third, cd into the app directory and run:
  * `npm install`
  * `electron-forge run`
  
If successful, the following window should appear:

![](https://raw.githubusercontent.com/ics-software-engineering/meteor-application-template-react/master/doc/landing-page.png)

## Current user problems that Designer should help solve:



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

