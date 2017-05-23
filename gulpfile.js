'use strict';

var gulp = require('gulp');
var electron = require('electron-connect').server.create();

gulp.task('serve', function () {
    electron.start();
    gulp.watch('app.js', electron.restart);
    gulp.watch(['src/index.js', 'src/index.html', 'src/style.css', 'src/match.js'], electron.reload);
});

gulp.task('reload:browser', function () {
    electron.restart();
});

gulp.task('reload:renderer', function () {
    electron.reload();
});

gulp.task('default', ['serve']);