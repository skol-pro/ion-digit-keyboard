var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var minifyCss = require('gulp-minify-css');
var css2js = require("gulp-css2js");
var sass = require('gulp-sass');
var rename = require('gulp-rename');

gulp.task('clean', function () {
    del(['dist/*']);
});

gulp.task('sass', function (done) {
    gulp.src('./src/*.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./dist/'))
        .on('end', done);
});

gulp.task('html2js', function () {
    return gulp.src(['./src/*.html'])
        .pipe(minifyHtml())
        .pipe(ngHtml2Js({
            moduleName: "ion-digit-keyboard.templates"
        }))
        .pipe(concat("templates.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist"));
});

gulp.task('css2js', ['sass'], function () {
    return gulp.src("./dist/*.css")
        .pipe(css2js())
        .pipe(uglify())
        .pipe(gulp.dest("./dist/"));
});

gulp.task('bundle', ['clean', 'html2js', 'css2js'], function (done) {
    gulp.src(['./dist/*.js', './src/*.js'])
        .pipe(concat('ion-digit-keyboard.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'))
        .on('end', function () {
            del(['dist/templates.js', 'dist/ion-digit-keyboard.min.css']);
            done();
        });
});

gulp.task('default', ['bundle']);

gulp.task('watch', function () {
    gulp.watch('./src/*', ['bundle']);
});
