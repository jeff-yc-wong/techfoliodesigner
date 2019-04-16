## Motivation

TechFolio Designer is a desktop app written using [Electron](http://electron.atom.io/) to simplify the development of professional portfolios using TechFolios.

Many of the students who attempt to build their professional portfolio using TechFolio do not have any prior experience with GitHub, Markdown, JSON, or even HTML. Worse, GitHub typically provides no error messages when an incorrectly formatted TechFolio file is committed and thus cannot be built by Jekyll. In this case, GitHub silently fails to rebuild the site. This makes it extremely difficult for a beginning TechFolio user to figure out what went wrong.

Some of the common problems that students encounter during initial development of their TechFolio include:

* Committing a bio.json file that is not in legal JSON format.
* Failure to remove the "sample" projects and essays from the template.
* Specifying a project or essay date that is not in YYYY-MM-DD format.
* Creating project or file names containing spaces.
* Incorrect or duplicate permalinks.
* Specifying markdown titles (`##`) without a space between the last `#` and the first character of the title.
* Spelling errors in projects and essays.
* Non-square images associated with project summary and home pages.

These problems are difficult for beginners to address since they typically use the browser-based interface to GitHub to create, delete, and edit files.

The goal of TechFolio Designer is to provide a desktop application that is specialized to the needs of beginning TechFolio development, and suitable for use by students with no prior exposure to GitHub, Markdown, JSON and HTML.

## Workflow

The basic workflow for TechFolio Designer is as follows:

First, the student follows current installation instructions to fork the TechFolio template into their own user account, and make minimal edits using the GitHub browser interface in order to display a "Molly Maluhia" TechFolio in their user account's github.io URL.

Second, the student downloads a binary release of TechFolio appropriate for their platform (Mac, Windows, Linux). The student runs the application and performs first-time setup: (a) Logging into GitHub, (b) Specifying the repository associated with their TechFolio, and (c) Specifying the local directory in which the files will be cloned. The student then runs a command in TechFolio Designer that clones their TechFolio repo onto their local file system.

Third, the student uses TechFolio Designer to develop their TechFolio. They can:
  * Create, edit, and delete essay and project files using a Markdown-aware editor.
  * Edit their bio.json file using either a JSON-aware editor or a simple form-based interface.
  * Add, delete, and crop image files. (Currently, this must be done manually, TechFolioDesigner does not yet support this.)

These editors should provide spell checking and validation on file front matter (i.e. YAML headers) in order to detect and notify the student of common errors.

Finally, the student can run a command within TechFolio Designer to push their changes back to GitHub so that the TechFolio can be published and available online.

Note that TechFolio Designer is meant to support the needs of new TechFolio users who are struggling to implement their first TechFolio using standard layouts.  Users who want to do advanced customization, such as the development of an alternative theme, should use a regular IDE such as IntelliJ IDEA for editing. So, TechFolio Designer need only provide access to a subset of the files associated with a TechFolio. In fact, "hiding" some of the complexity of a TechFolio from beginning users is a feature of TechFolioDesigner.

## Using TechFolio Designer

For more details, please consult the [User Guide](http://techfolios.github.io/designer.html) for instructions on how to install a binary distribution and use TechFolio Designer.

## Technologies and background reading

To develop TechFolio Designer, you must become familiar with the following technologies:

### Electron

Electron is a cross-platform framework for building desktop applications. To gain some initial familiarity with Electron, you can consult the following documentation:

  1. [Electron Home Page](https://electronjs.org/): The home page, with links to all official code and documentation. Spend a few minutes clicking around to familiarize yourself with the structure of this site.

  2. [What is Electron: The Hard Parts Made Easy](https://www.youtube.com/watch?v=8YP_nOCO-4Q): A 4 minute screencast) that provides a quick overview of the technology.

  3. The [Developer Environment](https://electronjs.org/docs/tutorial/development-environment) page explains how to set up your environment for Electron development. Check this to make sure you've got everything you need.

  4. [Writing your first Electron app](https://electronjs.org/docs/tutorial/first-app) provides a sample, simple Electron app ththat you and download and run locally. This is a great way to make sure that your environment is set up for Electron development.

  5. Once you have a trivial Electron app running, the [Electron APIs Demo App](https://github.com/electron/electron-api-demos) provides incredibly useful example code. Download the repo and run it, then interactively explore each feature. See the [documentation page](https://github.com/electron/electron-api-demos/blob/master/docs.md) for additional useful info.

  6. Another set of useful, simple sample applications are [Electron Simple Samples](https://electronjs.org/blog/simple-samples), including an activity monitor, hash value computation, video camera access, and external API calls (Yahoo Finance API). Download the sample code, run the apps, then read the source code to see how they did it.

  6. The [Electron Docs Page](https://electronjs.org/docs) provides links to dozens of pages covering the Electron API and much more. This is your "official" reference guide.

  7. [Awesome Electron](https://github.com/sindresorhus/awesome-electron) is a third-party, "unofficial" reference guide with links to sample apps, tools, articles, books, videos, podcasts and so forth. Definitely worth a look to see if there's naterial related to the feature you're working on. For example, I found [imagemin](https://github.com/imagemin/imagemin-app) which shows how to minify image files, several markdown editors, and building a file explorer.

  8. The [r/electronjs](https://www.reddit.com/r/electronjs) reddit channel seems to be a good source for late-breaking info and new packages.

### HTML/CSS

The user interface for Electron is built using HTML and CSS.  If you are not familiar with HTML and CSS, or need a refresher, please consult the [ICS 314s18 module on UI Basics](http://courses.ics.hawaii.edu/ics314s18/modules/ui-basics/).

### Semantic UI

Semantic UI is a CSS framework for building user interfaces. If you are not familiar with Semantic UI, or need a refresher, please consult the [ICS 314s18 module on UI frameworks](http://courses.ics.hawaii.edu/ics314s18/modules/ui-frameworks/).

### React

React is a Javascript user interface framework.  If you are not familiar with React, or need a refresher, please consult the [ICS 314s18 module on React](http://courses.ics.hawaii.edu/ics314s18/modules/react/).

Note that TechFolio Designer uses [Semantic UI React](https://react.semantic-ui.com/), a version of Semantic UI designed specifically for use with React.

### Redux

Redux is a framework for sharing state among React components.  In TechFolio Designer, Redux is used to enable the Console Log window to update automatically when git commands execute. Some useful documentation:

 * [Redux basics](https://redux.js.org/basics)
 * [Redux video tutorial #1](https://www.youtube.com/watch?v=1w-oQ-i1XB8), then [2](https://www.youtube.com/watch?v=9M-r8p9ey8U), [3](https://www.youtube.com/watch?v=ucd5x3Ka3gw), [4](https://www.youtube.com/watch?v=gBER4Or86hE), [5](https://www.youtube.com/watch?v=DJ8fR0mZM44), [6](https://www.youtube.com/watch?v=Td-2D-_7Y2E), and [7](https://www.youtube.com/watch?v=nrg7zhgJd4w). (About 75 minutes total. I used this tutorial to learn Redux and found it to be extremely clear.)

### Simple Git

For integration with Git, TechFolio Designer currently uses [Simple Git](https://github.com/steveukx/git-js). See the readme file for documentation.

### Code Mirror

TechFolio Designer uses Code Mirror as its editor library.

  * [Code Mirror Home Page](https://codemirror.net/)
  * [Build a desktop app with Code Mirror and Electron](https://medium.com/@rcwestlake/building-a-desktop-app-with-electron-codemirror-93b681237e60)


## Build from source

To build the system from source code for development purposes, begin by installing a recent version of [NodeJS](https://nodejs.org/en/) (10.5 or above).

Second, install [electron forge](https://electronforge.io/). (I used `sudo npm install -g electron-forge --allow-root` successfully, but it might be better to use [nvm](https://docs.npmjs.com/getting-started/installing-node#using-a-version-manager-to-install-nodejs-and-npm).)

Third, cd into the app directory and run `npm install`. The output looks similar to this:

```
npm install

> fs-xattr@0.1.17 install /Users/philipjohnson/github/techfolios/techfoliodesigner/app/node_modules/fs-xattr
> node-gyp rebuild

xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance

xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance

  CXX(target) Release/obj.target/xattr/src/async.o
../src/async.cc:35:15: warning: 'Call' is deprecated [-Wdeprecated-declarations]
    callback->Call(1, argv);
              ^
../../nan/nan.h:1617:3: note: 'Call' has been explicitly marked deprecated here
  NAN_DEPRECATED inline v8::Local<v8::Value>
  ^
../../nan/nan.h:98:40: note: expanded from macro 'NAN_DEPRECATED'
# define NAN_DEPRECATED __attribute__((deprecated))
                                       ^
../src/async.cc:129:15: warning: 'Call' is deprecated [-Wdeprecated-declarations]
    callback->Call(2, argv);
              ^
../../nan/nan.h:1617:3: note: 'Call' has been explicitly marked deprecated here
  NAN_DEPRECATED inline v8::Local<v8::Value>
  ^
../../nan/nan.h:98:40: note: expanded from macro 'NAN_DEPRECATED'
# define NAN_DEPRECATED __attribute__((deprecated))
                                       ^
../src/async.cc:186:15: warning: 'Call' is deprecated [-Wdeprecated-declarations]
    callback->Call(2, argv);
              ^
../../nan/nan.h:1617:3: note: 'Call' has been explicitly marked deprecated here
  NAN_DEPRECATED inline v8::Local<v8::Value>
  ^
../../nan/nan.h:98:40: note: expanded from macro 'NAN_DEPRECATED'
# define NAN_DEPRECATED __attribute__((deprecated))
                                       ^
3 warnings generated.
  CXX(target) Release/obj.target/xattr/src/error.o
  CXX(target) Release/obj.target/xattr/src/sync.o
  CXX(target) Release/obj.target/xattr/src/util.o
  CXX(target) Release/obj.target/xattr/src/xattr.o
  SOLINK_MODULE(target) Release/xattr.node

> macos-alias@0.2.11 install /Users/philipjohnson/github/techfolios/techfoliodesigner/app/node_modules/macos-alias
> node-gyp rebuild

xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance

xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance

  CXX(target) Release/obj.target/volume/src/volume.o
  SOLINK_MODULE(target) Release/volume.node

> electron-forge@5.2.2 install /Users/philipjohnson/github/techfolios/techfoliodesigner/app/node_modules/electron-forge
> node tabtab-install.js


> spawn-sync@1.0.15 postinstall /Users/philipjohnson/github/techfolios/techfoliodesigner/app/node_modules/spawn-sync
> node postinstall


> electron@2.0.3 postinstall /Users/philipjohnson/github/techfolios/techfoliodesigner/app/node_modules/electron-prebuilt-compile/node_modules/electron
> node install.js

added 1135 packages from 1664 contributors and audited 10286 packages in 24.359s
found 20 vulnerabilities (4 low, 15 moderate, 1 high)
  run `npm audit fix` to fix them, or `npm audit` for details

```

Fourth, run `electron-forge start`. The output looks similar to this:

```
electron-forge start
✔ Checking your system
✔ Locating Application
✔ Preparing native dependencies
✔ Launching Application
```

If successful, the following window should appear:

<img src="http://techfolios.github.io/images/designer/splash-window-initial.png" width="600" >


## Source code organization

The source for TechFolioDesigner is located in the src/ directory, and is organized into the following subdirectories:

| Directory | Contents |
| css/      | This directory contains the file style.css, which contains global style information. |
| lib/      | This directory contains third party libraries. The autorefresh.ext.js is a library that ensures that when a CodeMirror editor instance is created, the entire contents of the file being edited is displayed.  Due to some issue with CodeMirror, unless this extension is loaded, not all of the contents of a file is initially displayed until the window is clicked. |
| main/     | This directory contains code that runs only in the main process. That includes the main.js file and the MainMenu.js code for constructing the native menu. |
| redux/    | This directory contains the implementation of a Redux-based state manager. This is needed to support asynchronous updating of the Command Logs window within the Splash Page. |
| shared/   | This directory contains code for data structures that are available on both the main process and any browser (renderer) processes.  This is accomplished by adding instances of the data structures to the `app` instance.  These data structures are TechFolioFiles and TechFolioWindowManager. |
| simplebioeditor/ | This directory contains the implementation of the Simple Bio Editor, the forms-based editor for the bio.json file. It contains code that runs in the main process (SimpleBioEditorWindow.js) as well as code that runs in the renderer process (all of the other files). |
| splash/    | This directory contains the implementation of the "Splash" window that appears when no other window is displayed. |
| techfolioeditor/  | This directory contains the implementation of the TechFolioEditor for editing the Project and Essay markdown files, as well as the JSON formatted bio.json file. |


## Development Process

We use a [GitHub project](https://github.com/techfolios/techfoliodesigner/projects/1) to organize the tasks associated with development.

In most cases, each task is defined as a GitHub issue.  Work on that task is accomplished by creating a branch called issue-XX, where XX is the issue number.

When that task is completed, the issue-XX branch is merged into master. Anyone can merge into master when they think their branch is complete.

Currently, Philip is the only one who should create binary releases. In order to create a binary release:

  1. Make sure the master branch has no ESLint errors. Use `npm run lint` to check.
  2. Make sure the master branch is fully functional. Currently, we have no tests, so this verification must be done by hand.
  3. Update the version field in package.json in the master branch and commit the change.
  4. Merge the master branch into the release branch. This will kick off CI builds at [https://travis-ci.org/techfolios/techfoliodesigner](https://travis-ci.org/techfolios/techfoliodesigner) and [https://ci.appveyor.com/project/PhilipJohnson/techfoliodesigner](https://ci.appveyor.com/project/PhilipJohnson/techfoliodesigner). These builds will create binary versions for Mac, Windows, and Unix, and publish the results to the [TechFolio Designer Release Page](https://github.com/techfolios/techfoliodesigner/releases).
  5. If the release looks good, then go to the releases page and change its status from Draft to Published.
