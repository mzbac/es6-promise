var gulp = require("gulp");
var sourceMaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");

gulp.task("default",function () {
    return gulp.src("src/**/*.js")
        .pipe(sourceMaps.init()) //initialize source mapping
        .pipe(babel(({
            presets: ['es2015']
        }))) //transpile
        .pipe(sourceMaps.write(".")) //write source maps
        .pipe(gulp.dest("dist"));
});