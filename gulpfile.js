var gulp            = require('gulp');
var browserSync     = require('browser-sync');
var sass            = require('gulp-sass');
var prefix          = require('gulp-autoprefixer');
var cp              = require('child_process');
var jade            = require('gulp-jade');
var jade            = require('gulp-jade');
var imagemin        = require('gulp-imagemin');
var uglify          = require('gulp-uglify');
var babel           = require('gulp-babel');
var concat          = require('gulp-concat');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_dev/sass/main.sass')
        .pipe(sass({
            includePaths: ['_dev/sass'],
            outputStyle: 'compressed',
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
});

// Scripts compiling and concatenation

gulp.task('scripts', function() {

    return gulp.src('_dev/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe( concat('app.js'))
        .pipe( uglify() )
        .pipe(gulp.dest('_site/assets/js'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/js'));
})


/**
 * Jade compiling
 */

gulp.task('jade', function() {

    return gulp.src('_dev/jade/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('_includes'))

});




/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_dev/sass/**/*.sass', ['sass']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*', '_includes/*'], ['jekyll-rebuild']);
    gulp.watch('_dev/jade/*', ['jade']);
    gulp.watch('_dev/js/*', ['scripts']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
