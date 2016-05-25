var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jslint = require('gulp-jslint');
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
    browserSync = require ('browser-sync').create();


//  Init browserSync server functionality.
gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: ['src', 'dist'] 
    },
  })
})


/*  Compiles sass as 'expanded' then runs it through the
    autoprefixer and saves it to it's destination.
    The task will then create a minified version, auto-update the
    page and notify that the task is done. */

gulp.task('styles', function() {
  return sass('src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.reload({
      stream: true
     }))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});


// Experimental task that doesnt seem to work...
gulp.task('scripts', function(){
    return gulp.src(['assets/js/mainscript.js'])
            .pipe(jslint({ /* this object represents the JSLint directives being passed down */ }))
            .pipe(jslint.reporter( 'my-reporter' ));
});


//  A test task to see if I got the hang of building tasks in gulp.
gulp.task ('hello', function(){
  console.log('Why hello thar! :3');
})


/*  The 'watch' task that checks for changes in folders and 
    When a change is found it runns the task 'styles' or reload
    the  browser window. The task will only be run after 'browserSync' 
    and  'styles'.*/

gulp.task('watch', ['browserSync', 'styles'], function(){
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('assets/js/**/*.js', ['scripts'] , browserSync.reload);
})

