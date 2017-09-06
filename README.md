# Bath Boilerplate

A boilerplate for web projects built with Node/NPM and Webpack.

* Develop in ES6, Sass/SCSS, and future CSS syntax. The bundler converts future syntax into code that will run seamlessly in contemporary browsers. Sourcemaps are generated for easy debugging.
* Develop swiftly with automatic browser reloading. The development server detects changes to your source files and injects them into your browser.
* Easily install and import 3rd-party libraries. Install production dependencies via NPM (Lodash, jQuery, Bootstrap, etc.) and use ES6 import and CSS import to include them straight from your project's node_modules.
* Serve lightweight distribution files. The bundler concatenates and minifies files for distribution so that you always serve the lightest possible app with the fewest possible requests.

## Getting Started

### Prerequisite Software
1. [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
1. [Node and NPM](https://nodejs.org/en/download)

### Initialize
1. Extract the boilerplate to a fresh project directory.
1. Update the *package.json* file with your project's details.
1. Open a *Terminal* window and run `npm install`.

### Personalize
1. Delete the *README.md* file or overwrite it with your own.
1. Replace the *LICENSE.md* file with your project's license.
1. Delete the *.git* directory. Open a *Terminal* windows and run `git init` to start your own repository.

### Start the Development Server
1. Open a *Terminal* window.
1. `cd` to your project directory.
1. Run `npm run serve`.
1. Open [http://localhost:8080](http://localhost:8080) in your browser.
1. Edit files in the *src* directory. The bundler will detect changes and auto-update the browser.

### Build for Distribution
1. Open a *Terminal* window.
1. `cd` to your project directory.
1. Run `npm run buildProd`. The bundler will drop your project's concatenated, minified, production-ready files into its *build* directory.

## File Structure

#### src
Project source files

#### build
Browser-ready project files

* Emitted by Webpack

### Source Control

#### .git
Git repository

#### .gitignore
Git ignore configuration

* Lists filenames and blobs to be ignored by Git

### Dependency Management and Bundling

#### .package.json
NPM manifest

* Defines which packages are required for development
* Defines scripts for interacting with packages

#### node_modules
Node packages

* Managed by NPM

#### webpack.config.js
Webpack configuration

* Defines bundling rules for source files

#### postcss.config.js
PostCSS configuration

* Required by PostCSS (part of Webpack style bundling)
* PostCSS configuration handled in webpack.config.js
