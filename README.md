# uqlibrary-contacts

[![Codeship Status for uqlibrary/uqlibrary-contacts](https://codeship.com/projects/8d5d7470-bcc1-0133-4df8-129a4e5cf2b4/status?branch=master)](https://codeship.com/projects/136355)
[![Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-contacts.svg)](https://david-dm.org/uqlibrary/uqlibrary-contacts)
[![Dev Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-contacts/dev-status.svg)](https://david-dm.org/uqlibrary/uqlibrary-contacts?type=dev)

Default branch: **polymer1.0**

Used in [uqlibrary-mylibrary repo](https://github.com/uqlibrary/uqlibrary-mylibrary/).

 The full documentation and demo can be found in [GitHub Pages](https://uqlibrary.github.io/uqlibrary-contacts/uqlibrary-contacts/).

## Dev Setup

Java 8 is required, as are `node` and `npm`. Check `package.json` for required versions.

```bash
npm install -g gulp-cli web-component-tester bower polymer-cli
npm install
bower install
```

## Development

Run `gulp serve` to start a live-reloading web server and display the page in the default browser.

* Please adhere to the Polymer code style guide provided at [Style Guide](http://polymerelements.github.io/style-guide/).
* Colors and common styles are imported (bower install) from [uqlibrary-styles](http://github.com/uqlibrary/uqlibrary-styles).
* The docs can be viewed locally by running `npm start`. Use the second URL from the command output.
* GitHub pages should be updated after every commit to `polymer1.0` branch by running `bin/generate-gh-pages.sh`

## Testing

Run `npm test` to run local tests with `web-component-tester`. You can also run `wct` directly.
