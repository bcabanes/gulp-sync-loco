'use strict';
var _ = require('lodash');
var chalk = require('chalk');
var fs = require('fs');
var gutil = require('gulp-util');
var through = require('through2');

/**
 * Interns.
 */
var Synchronizr = require('./modules/synchronizr');

/**
 * Constants.
 */
var PLUGIN_NAME = 'gulp-sync-loco';

/**
 * Synchronize Loco
 * @param  {object} options Synchronize Loco's options.
 */
function gulpSyncLoco (options) {
    options = options || {};

    /**
     * Check lang parameter.
     */
    if (!_.isArray(options.lang) || !options.lang.length) {
        throw new gutil.PluginError(PLUGIN_NAME,
                chalk.red('Param lang required.'));
    }

    /**
     * Get api key if the path is setted
     */
    if (options.apiKeyPath) {
        try {
            options.apiKey = fs.readFileSync(options.apiKeyPath);
        } catch (error) {
            throw new gutil.PluginError(PLUGIN_NAME,
                chalk.red('Can not read the key file: ' + options.apiKeyPath));
        }
    }

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
            var sync = new Synchronizr(options);
            sync.testLocale('fr');
            sync.createTags();
            sync.sync(['webapp'], JSON.parse(content));
            gutil.log(chalk.blue(content));
        }
    });
}

module.exports = gulpSyncLoco;
