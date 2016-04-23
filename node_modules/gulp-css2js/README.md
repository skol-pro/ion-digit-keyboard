gulp-css2js - Embed CSS as JavaScript
=====================================

Ever wish you could distribute everything you needed as a single JavaScript file?  Your entire Angular application, from the modules to the templates can be turned into one minified file, but the CSS was still separate.  Until now, that is.

This [gulp] plugin lets you do exactly that.  It's extremely similar to the [grunt-css2js] task.  It works on buffers and on streams, so you are able to utilize it outside of [gulp] as well.  The code is supposed to be very readable and should be a candidate for use as an example when coding other plugins.

[![NPM][npm-image]][NPM]
[![Build Status][travis-image]][Travis CI]
[![Dependencies][dependencies-image]][Dependencies]
[![Dev Dependencies][devdependencies-image]][Dev Dependencies]


Usage
-----

Install `gulp-css2js` as a development dependency:

```shell
npm install --save-dev gulp-css2js
```

Next, add it to one of the streams in your `Gulpfile.js`:

```javascript
var css2js, gulp;

css2js = require("gulp-css2js");
gulp = require("gulp");

// CAREFUL - You probably do not want this
gulp.src("./lib/css/**/*.css")
    .pipe(css2js())
    .pipe(gulp.dest("./dist/javascript/"));
```

This will unfortunately separately change the CSS files into JavaScript.  You'll likely want to do some conversions and minifications when possible.  Here's a much better example, complete with comments explaining each step.

```javascript
var concat, css2js, cssmin, gulp, less, uglify;

concat = require("gulp-concat");
css2js = require("gulp-css2js");
cssmin = require("gulp-cssmin");
gulp = require("gulp");
less = require("gulp-less");
uglify = require("gulp-uglify");

// Load your CSS and LESS files
gulp.src([
        "./lib/css/**/*.css",
        "./lib/less/**/*.less"
    ])

    // Convert LESS files to CSS
    .pipe(less())

    // Concatenate into a single large file
    .pipe(concat("styles.css"))

    // Minify the CSS
    .pipe(cssmin())

    // Now convert it to JavaScript and specify options
    .pipe(css2js({
        splitOnNewline: false
    }))

    // Minify the JavaScript
    .pipe(uglify())

    // Finally write it to our destination (./build/styles.js)
    .pipe(gulp.dest("./build/"));
```

You would likely extend this a bit more and make sure this stream ends up as a member of the rest of the JavaScript that will be bundled together.

Using this technique, your CSS is now a single minified JavaScript file.  You can concatenate it with the rest of your JavaScript to bundle an entire Angular application as a single file download, or provide default styles with any JavaScript library that you are distributing.


How It Works
------------

CSS is simply wrapped in JavaScript code that creates a `<style>` element and adds the CSS text within that DOM node.

Need it to change so CSS is wrapped into a variable?  You can specify the prefix and suffix yourself!  The example below only illustrates how to set those particular options.

```javascript
// Just showing how to use `prefix` and `suffix`
gulp.src("./lib/css/**/*.css")
    .pipe(css2js({
        prefix: "var cssText = \"",
        suffix: "\";\n";
    }))
    .pipe(gulp.dest("./dist/javascript/"));
```


API
---

### css2js(options)

This creates a pipe through which all text is assumed to be CSS and will be wrapped with JavaScript that adds the styles to a `<style>` node in the document's `<head>`.

`options` is an object with the following possible properties:

* `prefix` - The string that should be added before the CSS.  By default it is set up to add a DOM `<script>` node with the CSS inserted as the text.  See also `suffix`.

* `splitOnNewline` (default: *true*) - When enabled, the resulting JavaScript will have each line of CSS on its own line.  This may help you in reading the resulting code.

* `suffix` - The string that should be added after the CSS.  By default it is set up to add a DOM `<script>` node with the CSS inserted as the text.  See also `prefix`.

* `trimSpacesBeforeNewline` (default: *true*) - Spaces at the end of a line have no use and can usually be safely eliminated.  One could also minify the CSS before passing it to css2js in order to eliminate these spaces as well.

* `trimTrailingNewline` (default: *true* for buffers) - All newlines at the end of the file can be represented in the JavaScript text if whitespace at the end is important.  However, in practice that extra newline is often unnecessary.


License
-------

This software is released under an MIT licence with an additional non-advertising clause.  See [LICENSE.md](LICENSE.md) for full details.


[Dependencies]: https://david-dm.org/tests-always-included/gulp-css2js
[dependencies-image]: https://david-dm.org/tests-always-included/gulp-css2js.png
[Dev Dependencies]: https://david-dm.org/tests-always-included/gulp-css2js#info=devDependencies
[devdependencies-image]: https://david-dm.org/tests-always-included/gulp-css2js/dev-status.png
[grunt-css2js]: https://github.com/ragiragi/grunt-css2js
[gulp]: https://github.com/wearefractal/gulp
[NPM]: https://npmjs.org/package/gulp-css2js
[npm-image]: https://nodei.co/npm/gulp-css2js.png?downloads=true&stars=true
[Travis CI]: http://travis-ci.org/tests-always-included/gulp-css2js?branch=master
[travis-image]: https://secure.travis-ci.org/tests-always-included/gulp-css2js.png
