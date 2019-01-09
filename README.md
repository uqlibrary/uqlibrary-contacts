# uqlibrary-contacts

[![Codeship Status for uqlibrary/uqlibrary-contacts](https://codeship.com/projects/8d5d7470-bcc1-0133-4df8-129a4e5cf2b4/status?branch=master)](https://codeship.com/projects/136355)
[![Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-contacts.svg)](https://david-dm.org/uqlibrary/uqlibrary-contacts)
[![Dev Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-contacts/dev-status.svg)](https://david-dm.org/uqlibrary/uqlibrary-contacts?type=dev)

Default branch: **polymer1.0**

Used in [uqlibrary-mylibrary repo](https://github.com/uqlibrary/uqlibrary-mylibrary/).

Demo is [here](https://uqlibrary.github.io/uqlibrary-contacts/uqlibrary-contacts/demo/).

## Dev Setup

Java 8 is required, as are `node` and `npm`. Check `package.json` for required versions.

```bash
npm install -g gulp-cli web-component-tester bower
npm install
bower install
```

## Development

Run `gulp serve` to start a live-reloading web server and display the page in the default browser.

GitHub pages should be updated after every commit to `polymer1.0` branch by running `bin/generate-gh-pages.sh`

## Testing

Run `npm test` to run local tests with `web-component-tester`. You can also run `wct` directly.
