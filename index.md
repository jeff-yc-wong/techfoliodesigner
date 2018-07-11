## Motivation

TechFolio Designer is a desktop app written using [Electron](http://electron.atom.io/) to simplify the development of professional portfolios using TechFolios.  

Many of the students who attempt to build their professional portfolio using TechFolio do not have any prior experience with GitHub, Markdown, JSON, or even HTML. Worse, GitHub typically provides no error messages when an incorrectly formatted TechFolio file is committed and thus cannot be built by Jekyll. In this case, GitHub silently fails to rebuild the site. This makes it extremely difficult for a beginning TechFolio user to figure out what went wrong. Some of the common problems that students encounter during initial development of their TechFolio include: 

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

<img src="https://github.com/techfolios/designer/raw/master/doc/splash-page.png" width="600" >

As instructed, you can use the Config menubar to select the directory containing your (previously cloned) TechFolio directory. Currently, TechFolio Designer does not integrate support for cloning and pushing to GitHub.

Once you have specified the directory containing your local copy of your TechFolio github.io repo, the "Bio", "Projects", and "Essays" menus should provide access to the associated TechFolio files.

*Important Note: TechFolio Designer sometimes exhibits a lag of 3-4 seconds when creating windows. Be patient. If the contents of a window has not appeared within 3-4 seconds, then you can use the View window to open the Developer Tools pane to see if an error has occurred.*

## Using TechFolio Designer

Currently, TechFolio Design provides just basic editing facilities. For example, here is the Markdown-aware editor that appears when editing an essay:

<img src="https://github.com/techfolios/designer/raw/master/doc/essay-editor.png" width="600" >

After you type a character, a "*" appears in the titlebar (as shown) to indicate that the buffer has been edited. Typing control-s (or command-S on Mac) will save out the file. 

Project files are edited in a similar fashion.

For the bio.json file, two options are available in the "Bio" menu. You can edit the JSON file directly:

<img src="https://github.com/techfolios/designer/raw/master/doc/json-editor.png" width="600" >

Or you can use a form editor:

<img src="https://github.com/techfolios/designer/raw/master/doc/json-form.png" width="600" >

The latter implements restrictions on what you can do (for example, only three Work Experiences can be listed), but the benefit is that it guarantees that the JSON syntax will be preserved.


## Ongoing development




