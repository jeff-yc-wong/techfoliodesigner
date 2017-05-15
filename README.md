TechFolio Designer is a desktop app written using [Electron](http://electron.atom.io/) to simplify the development of professional portfolios using TechFolios.

## Initial requirements

* Manage portfolios hosted in the *username*.github.io repository. While a TechFolio can technically be hosted in any repository, this constraint simplifies things for both the system and the user.  If a user wants to build a TechFolio in a different directory, then they presumably have the expertise to use a regular editor.

* Support development of portfolios from scratch, or manage a pre-existing portfolio. 

* Make it impossible to commit a syntactically invalid bio.json file. 

* Use the [Semantic UI](http://semantic-ui.com/) CSS framework. 

* Create and initialize a new *username*.github.io repo if one does not already exist, or clone the existing repo if it exists. 

* Provide a page to allow specification of home page (name, interests, social network links, etc.)

* Provide pages to support creation/editing of projects. Make it easy to unpublish/delete sample projects.

* Provide pages to support creation/editing of essays. Make it easy to unpublish/delete the sample essays.

* Provide a page to edit/update bio content.

* Provide a page to change themes and otherwise edit the _config.yml.

* Provide a local preview option. 

* Provide a way to easily manage images and other assets (PDF reports, etc.).

## Pain points addressed by Designer

* Removing the "sample" projects and essays should be easier.

* It should be impossible to commit a project or essay date in YYYY-MM-D format.

* No file names containing spaces.

* Easier understanding of how to rename the URL to retrieve a project or essay.

* Easier use of markdown.  Prevent problems like `##Title` that do not display correctly when formatted.

* Spell checking of essay and project text.

* Uploading of non-square images for using in project page or home page image.


