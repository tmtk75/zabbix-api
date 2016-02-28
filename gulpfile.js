var gulp = require('gulp');
var babel = require('gulp-babel');
var src_dir = './src/*.js'

gulp.task('default', ['compile', 'compile:watch'])

/** */
gulp.task('compile', function () {
  gulp.src(src_dir)
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('compile:watch', function(){
  gulp.watch(src_dir, ['compile']);
});

