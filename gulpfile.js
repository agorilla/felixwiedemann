const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const taskPath = './gulp/';

// async readdir does not identify task names
const taskList = require('fs').readdirSync(taskPath);

taskList.forEach(function (taskFile) {
    require(taskPath + taskFile)(gulp, plugins);
});

// Build tasks
gulp.task('dev', ['clean:dist', 'css:dev', 'copy']);
gulp.task('prod', ['clean:dist','css:prod', 'copy']);

// CSS tasks
gulp.task('css:dev', ['sass', 'postcss:dev']);
gulp.task('css:prod', ['sass', 'postcss:dev', 'postcss:prod']);

// Helper tasks
gulp.task('copy', ['copy:html', 'copy:content', 'copy:images', 'copy:fonts', 'copy:favicon']);
