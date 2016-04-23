/**
 * Embed CSS into JavaScript
 *
 * This will take your CSS and convert it into JavaScript.  When executed,
 * the resulting code will generate a <script> element and put the CSS text
 * into it.  Instead of having an external file for your necessary styles,
 * they are embedded into your library.
 *
 * As an exercise and possibly as an example for other Gulp developers,
 * this plugin supports both buffers and streams.
 */

(function () {
    'use strict';

    var defaultOptions, gulpUtil, through2;

    /**
     * @typedef {Object} gulpCss2js~options
     * @property {string} remainder Leftover newlines from last write
     * @property {string} [prefix]
     * @property {boolean} [splitOnNewline=true]
     * @property {string} [suffix]
     * @property {boolean} [trimSpacesBeforeNewline=true]
     * @property {boolean} [trimTrailingNewline=false]
     */

    /**
     * Get an options object
     *
     * @param {?Object} options
     * @return {gulpCss2js~options}
     */
    function getOptions(options) {
        var result;

        options = options || {};
        result = {
            remainder: '',
            remainderEncoding: 'utf8'
        };
        Object.keys(defaultOptions).forEach(function (key) {
            if (options[key] === undefined) {
                result[key] = defaultOptions[key];
            } else {
                result[key] = options[key];
            }
        });

        return result;
    }

    /**
     * Escapes content to be used in the middle of a JavaScript string.
     * This string will be surrounded by double quotes elsewhere, but this
     * is important because we need to escape double quotes in the buffers.
     *
     * @param {Buffer} bufferIn
     * @param {string} encoding
     * @param {gulpCss2js~options} options
     * @return {Buffer}
     */
    function escapeBuffer(bufferIn, encoding, options) {
        var lastLine, str;

        try {
            str = bufferIn.toString(encoding);
        } catch (e) {
            str = bufferIn.toString();
            encoding = 'utf8';
        }

        /* If there was a chunk left over from a previous write, add it back.
         * This portion of code should only get executed when:
         *     a stream is being processed
         *     a chunk ends in a newline
         *     another chunk comes after it
         */
        if (options.remainder) {
            str = options.remainder + str;
            options.remainder = '';
        }

        // Escape backslashes and double quotes
        str = str.replace(/\\/g, '\\\\');
        str = str.replace(/"/g, '\\"');

        // Newline conversion
        str = str.replace(/(\r?\n|\r)/g, '\n');

        // Remove spaces before newlines
        if (options.trimSpacesBeforeNewline) {
            str = str.replace(/[\t ]*\n/g, '\n');
        }

        /* We grab the last line of content and all following newlines
         * and put it into options.remainder.  This is necessary for
         * processing streams.
         */
        lastLine = str.match(/[^\n]+\n*$/);
        options.remainderEncoding = encoding;

        if (lastLine && lastLine[0]) {
            options.remainder = lastLine[0];
            str = str.replace(/[^\n]+\n*$/, '');
        } else {
            options.remainder = str;
            str = '';
        }

        // Break on newlines
        if (options.splitOnNewline) {
            str = str.replace(/\n/g, '\\n" +\n"');
        } else {
            str = str.replace(/\n/g, '\\n');
        }

        return new Buffer(str, encoding);
    }

    function getRemainder(options) {
        var newlines, str;

        str = options.remainder;
        options.remainder = '';

        // Trim the last newlines
        if (options.trimTrailingNewline) {
            newlines = str.match(/\n*$/);

            if (newlines && newlines[0]) {
                options.remainder = newlines[0];
                str = str.replace(/\n*$/, '');
            }
        }

        // Break on newlines
        if (options.splitOnNewline) {
            /* Prevent the last line from looking like this when encoded:
             *    ".css { display: block }\n" +
             *    ""
             */
            str = str.replace(/\n$/, '\\n');
            str = str.replace(/\n/g, '\\n" +\n"');
        } else {
            str = str.replace(/\n/g, '\\n');
        }

        return new Buffer(str, options.remainderEncoding);
    }

    /**
     * Uses Through2 to create a stream translation that converts CSS
     * into JavaScript.
     *
     * @param {gulpCss2js~options} options
     * @return {Stream}
     */
    function convertStream(options) {
        var outStream;

        outStream = through2(function (chunk, encoding, callback) {
            this.push(escapeBuffer(chunk, encoding, options));
            callback();
        }, function (callback) {
            this.push(getRemainder(options));
            this.push(new Buffer(options.suffix, 'utf8'));
            callback();
        });
        outStream.push(new Buffer(options.prefix, 'utf8'));

        return outStream;
    }

    gulpUtil = require('gulp-util');
    through2 = require('through2');

    module.exports = function (options) {
        options = getOptions(options);

        return through2.obj(function (file, encoding, callback) {
            if (file.isBuffer()) {
                file.contents = Buffer.concat([
                    new Buffer(options.prefix, 'utf8'),
                    escapeBuffer(file.contents, encoding, options),
                    getRemainder(options),
                    new Buffer(options.suffix, 'utf8')
                ]);
                file.path = gulpUtil.replaceExtension(file.path, ".js");
            } else if (file.isStream()) {
                file.contents = file.contents.pipe(convertStream(options));
                file.path = gulpUtil.replaceExtension(file.path, ".js");
            } else if (!file.isNull()) {
                // Not sure what this could be, but future-proofing the code.
                this.emit('error', new gulpUtil.PluginError('gulp-css2js', 'Unhandled file source type.'));
                return callback();
            }

            this.push(file);
            return callback();
        });
    };

    module.exports.defaultOptions = defaultOptions = {
        prefix: '(function (doc, cssText) {\n' +
            '    var styleEl = doc.createElement("style");\n' +
            '    doc.getElementsByTagName("head")[0].appendChild(styleEl);\n' +
            '    if (styleEl.styleSheet) {\n' +
            '        if (!styleEl.styleSheet.disabled) {\n' +
            '            styleEl.styleSheet.cssText = cssText;\n' +
            '        }\n' +
            '    } else {\n' +
            '        try {\n' +
            '            styleEl.innerHTML = cssText;\n' +
            '        } catch (ignore) {\n' +
            '            styleEl.innerText = cssText;\n' +
            '        }\n' +
            '    }\n' +
            '}(document, "',
        splitOnNewline: true,
        suffix: '"));\n',
        trimSpacesBeforeNewline: true,
        trimTrailingNewline: true
    };
}());
