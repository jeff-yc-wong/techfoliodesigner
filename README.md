TechFolio Designer is a desktop app written using [Electron](http://electron.atom.io/) to simplify the development of professional portfolios using TechFolios.

Initial requirements for the system include:

* The Designer need only manage portfolios hosted in the *username*.github.io repository. While TechFolios can be hosted in any repository, this constraint simplifies things for both the system and the user.  If a user wants to build a TechFolio in a different directory, then they presumably have the expertise to use a regular editor.

* The Designer can be used to develop portfolios from scratch, or can be pointed at an existing *username*.github.io repository in order to manage a pre-existing portfolio. 

* The Designer should make it impossible for the user to commit a syntactically invalid bio.json file. 

* The Designer should use the [Semantic UI](http://semantic-ui.com/) CSS framework. 

* The Designer can assume that the user has already created a GitHub account.  Once the user has logged in to GitHub through the Designer, the designer can check to see if a *username*.github.io repository exists. If so, it should assume that this repository is a TechFolio repo and attempt to download it.   If not, it should ask the user if it's OK to proceed to create a *username*.github.io account. If confirmed, then the system should fork the TechFolio/template, then rename it to *username*.github.io per the QuickStart.

* It would be awesome if the initial version of the Designer is available by the first week of Spring semester so it can be deployed in ICS 314.  (The Professional Portfolio module typically starts in Week 1. It could be delayed by a week if necessary.)

More advanced features include:

* Take a picture of the user using the laptop camera, crop it to a square, and use it as the profile photo.

* WYSIWYG editing of essays and projects.

* Spell-checking.


