TechFolio Designer is a desktop app written using [Electron](http://electron.atom.io/) to simplify the development of professional portfolios using TechFolios.

## Initial requirements

* The Designer need only manage portfolios hosted in the *username*.github.io repository. While TechFolios can be hosted in any repository, this constraint simplifies things for both the system and the user.  If a user wants to build a TechFolio in a different directory, then they presumably have the expertise to use a regular editor.

* The Designer can be used to develop portfolios from scratch, or can be pointed at an existing *username*.github.io repository in order to manage a pre-existing portfolio. 

* The Designer should make it impossible for the user to commit a syntactically invalid bio.json file. 

* The Designer should use the [Semantic UI](http://semantic-ui.com/) CSS framework. 

* The Designer can assume that the user has already created a GitHub account.  Once the user has logged in to GitHub through the Designer, the designer can check to see if a *username*.github.io repository exists. If so, it should assume that this repository is a TechFolio repo and attempt to download it.   If not, it should ask the user if it's OK to proceed to create a *username*.github.io account. If confirmed, then the system should fork the TechFolio/template, then rename it to *username*.github.io per the QuickStart.

## Pain points addressed by Designer

* Removing the "sample" projects should be easier.

* It should be impossible to commit a project or essay date in YYYY-MM-D format.

* No file names containing spaces.

* Easier understanding of how to rename the URL to retrieve a project or essay.

* Easier use of markdown.  Prevent problems like `##Title` that do not display correctly when formatted.

* Spell checking of essay and project text.

* Uploading of non-square images for using in project page or home page image.


