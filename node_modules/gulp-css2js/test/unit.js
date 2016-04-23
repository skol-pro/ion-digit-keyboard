/**
 * Gulp plugins really aught to have tests.  Here's some great tests for
 * gulp-css2js.
 */
/*global afterEach, beforeEach, describe, it*/

'use strict';

var Assert, css2js, defaultOptions, gulpUtil, stream;

Assert = require('assert');
css2js = require('../');
defaultOptions = JSON.parse(JSON.stringify(css2js.defaultOptions));
gulpUtil = require('gulp-util');
stream = require('stream');

function runThroughStream(expected, srcFile, options, done) {
    var stream;

    stream = css2js(options);
    stream.on("data", function (newFile) {
        var buffer;

        Assert.equal(newFile.path, expected.path);
        Assert.equal(newFile.cwd, expected.cwd);
        Assert.equal(newFile.base, expected.base);

        if (newFile.isStream()) {
            // Convert a stream into a buffer and test when it's done
            buffer = '';
            newFile.contents.on('data', function (chunk, encoding) {
                buffer += chunk.toString(encoding);
            });
            newFile.contents.on('end', function () {
                Assert.equal(buffer, expected.contents.toString());
                done();
            });
        } else if (expected.contents === null) {
            Assert.equal(newFile.contents, expected.contents);
            done();
        } else {
            Assert.equal(newFile.contents.toString(), expected.contents.toString());
            done();
        }
    });
    stream.write(srcFile);
    stream.end();
}

function makeFile(contents, path) {
    if (typeof contents === 'string') {
        contents = new Buffer(contents, 'utf8');
    }

    return new gulpUtil.File({
        path: path || "test/styles/testing.css",
        cwd: "test/",
        base: "test",
        contents: contents
    });
}

function makeEncodedFile(contents) {
    contents = defaultOptions.prefix + contents + defaultOptions.suffix;

    return makeFile(contents, "test/styles/testing.js");
}

describe('gulp-css2js', function () {
    it('exported a function', function () {
        Assert.equal('function', typeof css2js);
    });

    describe('null files', function () {
        it('passes them through', function (done) {
            runThroughStream(makeFile(null), makeFile(null), {}, done);
        });
    });

    // Two scenarios - buffered files and streamed files
    [
        {
            name: 'when processing buffered files',
            process: function (expected, actual, options, done) {
                actual = [].concat(actual).join('');
                runThroughStream(makeEncodedFile(expected), makeFile(actual), options, done);
            }
        },
        {
            name: 'when processing streamed files',
            process: function (expected, actual, options, done) {
                var sourceFile, streamChunks;

                streamChunks = [].concat(actual);
                sourceFile = makeFile('');
                sourceFile.contents = new stream.Readable();
                sourceFile.contents._read = function () {
                    if (streamChunks.length) {
                        this.push(new Buffer(streamChunks.shift(), 'utf8'), 'utf8');
                    } else {
                        this.push(null);
                    }
                };
                runThroughStream(makeEncodedFile(expected), sourceFile, options, done);
            }
        }
    ].forEach(function (scenario) {
        describe(scenario.name, function () {
            it('embeds CSS', function (done) {
                scenario.process('.d-b {\\n" +\n"    display: block\\n" +\n"}', [
                    '.d-b {\n',
                    '    display: block\n',
                    '}'
                ], {}, done);
            });
            it('compensates for newlines at the end of chunks', function (done) {
                scenario.process('line1 {}\\n" +\n"line2 {}', [
                    'line1 {}\n',
                    'line2 {}\n'
                ], {
                    trimTrailingNewline: true
                }, done);
            });
            describe('options', function () {
                describe('prefix and suffix', function () {
                    var oldPrefix, oldSuffix;

                    beforeEach(function () {
                        oldPrefix = defaultOptions.prefix;
                        oldSuffix = defaultOptions.suffix;
                        defaultOptions.prefix = 'XXX';
                        defaultOptions.suffix = 'YYY';
                    });
                    afterEach(function () {
                        defaultOptions.prefix = oldPrefix;
                        defaultOptions.suffix = oldSuffix;
                    });
                    it('reflects changes to the strings', function (done) {
                        scenario.process('abc', 'abc', {
                            prefix: 'XXX',
                            suffix: 'YYY'
                        }, done);
                    });
                });
                describe('splitOnNewline', function () {
                    var disabledOutput, enabledOutput, input;

                    beforeEach(function () {
                        input = [
                            "body { margin: 0 }\n",
                            "h1 { padding-top: 10px }\n"
                        ];
                        disabledOutput = 'body { margin: 0 }\\nh1 { padding-top: 10px }\\n';
                        enabledOutput = 'body { margin: 0 }\\n" +\n"h1 { padding-top: 10px }\\n';
                    });
                    it('defaults to true', function (done) {
                        scenario.process(enabledOutput, input, {
                            trimTrailingNewline: false
                        }, done);
                    });
                    it('does not break lines if disabled', function (done) {
                        scenario.process(disabledOutput, input, {
                            splitOnNewline: false,
                            trimTrailingNewline: false
                        }, done);
                    });
                    it('breaks on newlines but avoids empty string concatenation at the end when enabled', function (done) {
                        scenario.process(enabledOutput, input, {
                            splitOnNewline: true,
                            trimTrailingNewline: false
                        }, done);
                    });
                });
                describe('trimSpacesBeforeNewline', function () {
                    var disabledOutput, enabledOutput, input;

                    beforeEach(function () {
                        input = "a, \t \ndiv { display: block }    \n";
                        disabledOutput = 'a, \t \\ndiv { display: block }    ';
                        enabledOutput = 'a,\\ndiv { display: block }';
                    });
                    it('defaults to true', function (done) {
                        scenario.process(enabledOutput, input, {
                            splitOnNewline: false
                        }, done);
                    });
                    it('does not trim spaces if disabled', function (done) {
                        scenario.process(disabledOutput, input, {
                            splitOnNewline: false,
                            trimSpacesBeforeNewline: false
                        }, done);
                    });
                    it('trims spaces when enabled', function (done) {
                        scenario.process(enabledOutput, input, {
                            splitOnNewline: false,
                            trimSpacesBeforeNewline: true
                        }, done);
                    });
                });
                describe('trimTrailingNewline', function () {
                    var disabledOutput, enabledOutput, input;

                    beforeEach(function () {
                        input = [
                            "div {\n\n",
                            "    display",
                            ": block\n\n",
                            "}\r\n"
                        ];
                        disabledOutput = 'div {\\n" +\n"\\n" +\n"    display: block\\n" +\n"\\n" +\n"}\\n';
                        enabledOutput = 'div {\\n" +\n"\\n" +\n"    display: block\\n" +\n"\\n" +\n"}';
                    });
                    it('defaults to true', function (done) {
                        scenario.process(enabledOutput, input, {}, done);
                    });
                    it('does not trim newline if disabled', function (done) {
                        scenario.process(disabledOutput, input, {
                            trimTrailingNewline: false
                        }, done);
                    });
                    it('trims newline when enabled', function (done) {
                        scenario.process(enabledOutput, input, {
                            trimTrailingNewline: true
                        }, done);
                    });
                });
            });
            describe('escaping', function () {
                it('escapes as necessary', function (done) {
                    var escaped, unescaped;

                    unescaped = '';
                    escaped = '';

                    // Double quotes - yes
                    unescaped += '"';
                    escaped += '\\"';

                    // Single quotes - no
                    unescaped += "'";
                    escaped += "'";

                    // Newlines are converted - Unix, DOS, old Mac
                    unescaped += "\n \r\n \r";
                    escaped += "\\n \\n \\n";

                    // Tabs - no
                    unescaped += "\t";
                    escaped += "\t";

                    scenario.process(escaped, unescaped, {
                        splitOnNewline: false,
                        trimSpacesBeforeNewline: false,
                        trimTrailingNewline: false
                    }, done);
                });
            });
        });
    });
});
