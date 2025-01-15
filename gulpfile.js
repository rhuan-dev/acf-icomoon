// gulp
const {src, dest, parallel, series, watch} = require('gulp');

// css plugins
const sass = require('gulp-sass')(require('sass'));
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
const merge2 = require('merge2');

/**
 * Compile CSS
 */
const sassNodePlugins = [
    // styles plugin fonticonpicker
    'assets/lib/fonticonpicker/css/base/jquery.fonticonpicker.min.css',
    'assets/lib/fonticonpicker/css/themes/grey-theme/jquery.fonticonpicker.grey.min.css'
];

const sassFiles = [
    // main styles
    'assets/sass/**/*.scss'
];

function css() {
    // node plugins
    const pluginsStream = src(sassNodePlugins);

    //sass files to merge
    const sassStream = src(sassFiles)
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer());

    return merge2(pluginsStream, sassStream)
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
    // js fonticonpicker plugin
    'assets/lib/fonticonpicker/js/jquery.fonticonpicker.min.js',

    // config main select icon
    'assets/js/select-icon.js'
];

function js() {
    return src(jsFiles)
        .pipe(plumber())
        .pipe(concat('bundle.js'))
        .pipe(dest('assets/dist/js'))
        .pipe(rename('bundle.min.js'))
        .pipe(babel({
            presets: [
                ['@babel/preset-env', {
                    modules: false,
                    targets: {
                        browsers: [
                            'last 2 versions',
                            '> 1%',
                            'not dead'
                        ]
                    }
                }]
            ],
        }))
        .pipe(uglify())
        .pipe(dest('assets/dist/js'));
}

/**
 * Watch files
 */
function watchFiles() {
    watch(sassFiles, {usePolling: true}, css);
    watch(jsFiles, {usePolling: true}, js);
}

/**
 * Complex tasks
 */
const server = parallel(series(js, css, watchFiles));
const build = series(js, css);

/**
 * Exports tasks
 */
exports.css = css;
exports.js = js;
exports.build = build;
exports.server = server;
exports.default = server;