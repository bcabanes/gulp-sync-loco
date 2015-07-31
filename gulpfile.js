(function () {
    'use strict';

    var gulp = require('gulp');
    var syncLoco = require('./');

    function synchronise () {
        return gulp.src('fixtures/tokens-en.json')
            .pipe(syncLoco({
                lang: 'en_CA',
                apiKeyPath: './loco.api.key',
                tags: ['webapp', 'otherTag'],
                // Some options here.
            }))
            .pipe(gulp.dest('dest'));
    }

    gulp.task('default', synchronise);
})();
