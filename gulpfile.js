var gulp = require('gulp');
var beeper = require('beeper');
var browserify = require('browserify');
var browsersync = require('browser-sync');
var concat = require('gulp-concat');
var del = require('del');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

function onError(err) {
  beeper();
  console.log(err);
}

gulp.task('browserify', function(){
  return browserify('./app/js/app.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('browsersync', function(cb){
  return browsersync({
    server: {
      baseDir: './'
    }
  }, cb);
});

gulp.task('clean', function(cb){
  return del(['dist/*'], cb);
});

gulp.task('images', function(){
  return gulp.src('app/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('scripts', function() {
  return gulp.src('app/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
  return gulp.src('app/css/*.scss')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
  gulp.watch('*.html', browsersync.reload);
  gulp.watch('app/css/*', 
    gulp.series('styles', browsersync.reload));
  gulp.watch('app/js/*.js', 
    gulp.series('scripts', browsersync.reload));
  gulp.watch('app/img/*', 
    gulp.series('images', browsersync.reload));
});

gulp.task('default', gulp.parallel('browsersync', 'styles', 'scripts', 'images', 'watch'));