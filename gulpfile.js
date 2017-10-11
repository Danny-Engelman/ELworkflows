var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    tap = require('gulp-tap'),
    buffer = require('gulp-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),

  coffeeSources = ['components/coffee/tagline.coffee'];
  jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
      .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function () {
    return gulp.src(jsSources, {read: false}) // no need of reading file because browserify does.
      // transform file objects using gulp-tap plugin
      .pipe(tap(function (file) {
          gutil.log('bundling ' + file.path);
          // replace file contents with browserify's bundle stream
        file.contents = browserify(file.path, {debug: false}).bundle();
      }))
        // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
      .pipe(buffer())
        // load and init sourcemaps
      // .pipe(sourcemaps.init({loadMaps: true}))
      //   .pipe(uglify())
      //   // write sourcemaps
      // .pipe(sourcemaps.write('./'))
        //.pipe(concat('script.js'))
        .pipe(gulp.dest('builds/development/js'));
    });

gulp.task('js1', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    //.pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
});


gulp.task('bs', function () {
  var b = browserify({
    entries: './builds/development/js/script.js', // Only need initial file, browserify finds the deps
    debug: true        // Enable sourcemaps
  });

  return b.bundle()
//    .pipe(source('./builds/development/js/script.js')) // destination file for browserify, relative to gulp.dest
    // .pipe(buffer())
    // .pipe(uglify())
    //.pipe(gulp.dest('.'));
});