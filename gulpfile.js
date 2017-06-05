const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const connect = require('gulp-connect');
const jsHint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const minimist = require('minimist');
const ngConfig = require('gulp-ng-config');
const plumber = require('gulp-plumber');
const karma = require('gulp-karma');
const clean = require('gulp-clean');
const jscs = require('gulp-jscs');
const jscsStylish = require('gulp-jscs-stylish');
const jshintXMLReporter = require('gulp-jshint-xml-file-reporter');
const gulpFile = require('gulp-file');
const rename = require("gulp-rename");
const replace = require('gulp-replace');
const gulpIf = require('gulp-if');
const Server = require('karma').Server;

var knownOptions = {
    string: 'env',
    default: {env: 'dev'}
};
var options = minimist(process.argv.slice(2), knownOptions);
var scriptRoot = 'client/app';
var contentRoot = 'client/content/';
var scriptFolder = scriptRoot + '/**/*.js';
var jsHintOutput = './jshint.xml';

//Task for compiling custom JS files - concat, uglify, generate source maps and move to dist
gulp.task('scripts', function() {
    return gulp.src([
        scriptRoot + '/**/app.js',
        scriptRoot + '/**/!(app).js'
    ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
        "presets": ["es2015"]
  	}))
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
});

//Task for compiling custom CSS files - concat, compress and move to dist
gulp.task('sass', function() {
    return gulp.src([contentRoot + 'css/styles.scss'])
    .pipe(sass({includePaths: [contentRoot +'/css']}))
    .pipe(plumber())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('fonts', function() {
    return gulp.src([
        'node_modules/bootstrap/fonts/*.*',
        contentRoot +'fonts/*.*'
    ])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('vendorCss', function() {
    return gulp.src([
        'node_modules/**/**.min.css'
    ])
    .pipe(plumber())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('vendorScripts', function() {
    return gulp.src([
        'node_modules/**/jquery.min.js',
        'node_modules/**/angular.min.js',
        'node_modules/**/bootstrap.min.js',
        'node_modules/**/angular-ui-router.min.js',
        'node_modules/lodash/lodash.min.js'
    ])
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('templates', function() {
    gulp.src('index.html')
    .pipe(gulp.dest('dist'));
    gulp.src([
        contentRoot + 'partials/**/*.html',
        scriptRoot + '/**/*.html'
        ]).pipe(gulp.dest('dist/partials'));
    return gulp.src(contentRoot + 'images/**/*').pipe(gulp.dest('dist/images'));
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('watch', ['sass', 'scripts', 'templates', 'lint'], function() {
    gulp.watch(contentRoot + 'css/**/*.scss', ['sass']);
    gulp.watch('*.json', ['api_path']);
    gulp.watch(scriptFolder, ['scripts', 'lint']);
    gulp.watch([
            'index.html',
            contentRoot + 'partials/**/*.html',
            scriptRoot + '/**/*.html',
            contentRoot + 'images/**/*'
        ], ['templates']
    );
});

gulp.task('api_path', function() {
	var env = options.env || 'dev';
	gulp.src('api.config.json')
	 .pipe(ngConfig('app.config', {
         pretty: true
	 }))
	 .pipe(gulp.dest('dist'));

     gulp.src(env+'.config.json')
     .pipe(ngConfig('app.config', {
         createModule: false,
         pretty: true
     }))
     .pipe(rename('app.config.js'))
     .pipe(gulp.dest('dist'));
 });

gulp.task('server', function() {
    connect.server({
        root: 'dist',
        port: 8080,
        livereload: true,
        fallback: 'dist/index.html'
    });
});

gulp.task('lint', function() {
    return gulp.src([
        scriptFolder
    ])
    .pipe(jsHint())
    .pipe(jscs())
    .on('error', function() {})
    .pipe(jscsStylish.combineWithHintResults())
    .pipe(jsHint.reporter(stylish));
});

gulp.task('lint-xmlout', function() {
    return gulp.src(scriptFolder)
    .pipe(jsHint())
    .pipe(jscs())
    .on('error', function() {})
    .pipe(jscsStylish.combineWithHintResults())
    .pipe(jsHint.reporter(stylish))
    .pipe(jsHint.reporter(jshintXMLReporter))
    .on('end', jshintXMLReporter.writeFile({
        format: 'checkstyle',
        filePath: jsHintOutput
    }));
});

gulp.task('clean', function() {
    gulp.src(jsHintOutput, {read: false})
        .pipe(clean());
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

//Default Task - used for local system build
gulp.task('default', function() {
    gulp.start('templates');
    gulp.start('fonts');
    gulp.start('vendorCss');
    gulp.start('sass');
    gulp.start('vendorScripts');
    gulp.start('scripts');
    gulp.start('api_path');
    gulp.start('server');
    gulp.start('watch');
});
