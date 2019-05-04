// gulp
const {src, dest, parallel, series, watch} = require('gulp');

// css plugins
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sassGlob = require('gulp-sass-glob');
const cleanCSS = require('gulp-clean-css');

// js plugins
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

// utilities
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const merge = require('merge-stream');

/**
 Compile CSS
 */
const sassNodePlugins = [];

const sassFiles = [
    'assets/sass/**/*.scss'
];

function css() {
    // nodep lugins
    const pluginsStream = src(sassNodePlugins);

    //sass files to merge
    const sassStream = src(sassFiles)
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass.sync({outputStyle: 'nested'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade : false
        }));

    return merge(pluginsStream, sassStream)
        .pipe(concat('style.css'))
        .pipe(cleanCSS({
            level: {
                1: {
                    specialComments: 1
                }
            }
        }))
        .pipe(dest('assets/dist/css'));
}

/**
 * Compile JS
 */
const jsFiles = [
    'assets/js/main.js'
];

function js() {
    return src(jsFiles)
        .pipe(concat('bundle.js'))
        .pipe(dest('assets/dist/js'))
        .pipe(rename('bundle.min.js'))
        .pipe(babel({
            presets: [
                ['@babel/preset-env', {
                    modules: false
                }]
            ],
        }))
        .pipe(uglify())
        .pipe(dest('assets/dist/js'))
        .pipe(browserSync.stream());
}

/**
 * Watch files
 */
const filesToWatch = [
    '*.php',
];
function watchFiles() {
    watch(sassFiles, {usePolling: true}, css);

    watch(jsFiles, {usePolling: true}, js);
}

/**
 * Complex task
 * @type {function(): *}
 */
const server = parallel(series(js, css, watchFiles));
const build = series(js, css);

/**
 * Exports tasks
 * @type {function(): *}
 */
exports.css = css;
exports.cssAdmin = cssAdmin;
exports.js = js;
exports.build = build;
exports.server = server;
exports.default = server;