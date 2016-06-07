# Plexus #
Express app Boilerplate for rapid app development. This branch is the Master branch of the boilerplate. For the same boilerplate but with Electron.js intergration use the [Electron Branche](https://github.com/jbstoker/Plexus/tree/master_electron "Electron Intergration")

> Warning this is an project created for my own fun and learning curve. You are free to fork or pull one of the plexus branches, but i won't do bug-fixes of any kind. Also i won't answer to an feature request of sorts.

## Default Pages ##
- Login/Register/Contact
		Page with 3 tabs
		
- Login
- Lock
- User management
- Profile
- User settings page

# Usage #
Plexus uses two package managers, Node and Bower. Before you start the app you should update the packages for these managers.
## install/update ##
Run `npm install` to install/update the NodeJS packages and run `bower update` for the Bower packages.
## Starting app ##
The package.json file contains all start data, just start the app with `npm start` and all Grunt Tasks will be runned also.

## Structure ##
- bin
	- www 
		> *www file for express.js*
- bower_components 
	> *bower library folder*
- config 
	> *config files and middlewares*
	- dev-css
		
> - backend.less
		- base.less
		- demopages.css
		- fonts.css
		- fontend.less
		- loader.less
		- side-toggle.css
		- toggle.less
	- dev-fonts
	- dev-js
	- env
	- tests
	- theme
- controllers 
	> controller files
- data 
	> mongodb datafiles
- models   (model files)
- node_modules (nodejs libary)
- public (public folder)
- routes (route files)
- views (view files in .hbs)
- app.js (app file nodejs)
- bower.json (bower config file)
- Gruntfile.js (grunt config file)
- package.json (plexus package config file)
- README.md (this file)

# Components #
## Node ##
## Express ##
## Grunt ##
## Bower ##
## Twitter Bootstrap ##
## Summernote Editor ##

# Storage #
## Redis ##
## MongoDB ##

# Theme #

# Testing #

