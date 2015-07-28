(function () {
    'use strict';

    var gulp = require('gulp');
    var syncLoco = require('./');

    function synchronise () {
        return gulp.src('fixtures/tokens-en.json')
            .pipe(syncLoco({
                // Some options here.
            }));
    }

    gulp.task('default', synchronise);
})();
