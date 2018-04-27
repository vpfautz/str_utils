var gulp = require('gulp');
var ts = require('gulp-typescript');
const babel = require('gulp-babel');
var merge = require('merge2');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', function () {
    var tsResult = gulp.src('ts/**/*.ts')
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest('definitions')),
        tsResult.js
            .pipe(babel({
                presets: ['env']
            }))
            .pipe(gulp.dest('js'))
    ]);
});
