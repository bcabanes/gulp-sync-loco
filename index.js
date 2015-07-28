'use strict';
var _ = require('lodash');
var chalk = require('chalk');
var gutil = require('gulp-util');
var request = require('request-promise');
var stringify = require('json-stable-stringify');
var through = require('through2');

/**
 * Constants.
 */
var PLUGIN_NAME = 'gulp-sync-loco';

function gulpSyncLoco (options) {
    options = options || {};

    /**
     * Set all needed variables
     */
    var firstFile;

    /**
     * Gulp Sync Loco start processing
     */
    return through.obj(function (file, enc, callback) {
        if (file.isStream()) {
            throw new gutil.PluginError(PLUGIN_NAME,
                chalk.red('Streaming not supported'));
        }

        if (file.isNull()) {
            // Return empty file.
            callback(null, file);
        }

        if (!firstFile) {
            firstFile = file;
        }

        if (file.isBuffer()) {
            /**
             * Start synchronizing with Loco
             */
            var content = file.contents.toString();
            gutil.log(chalk.blue(content));
        }
    });
}

module.exports = gulpSyncLoco;
