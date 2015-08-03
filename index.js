'use strict';
var _ = require('lodash');
var chalk = require('chalk');
var fs = require('fs');
var gutil = require('gulp-util');
var path = require('path');
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
    if (!options.lang) {
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
    var content,
        firstFile,
        sync;

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
            var self = this;

            /**
             * Start synchronizing with Loco
             */
            content = file.contents.toString();
            sync = new Synchronizr(options);
            return sync.testLocale()
                .then(sync.createTags(options.lang))
                .then(sync.process(options.lang, options.tags, JSON.parse(content)))
                .then(function(merge) {
                    self.push(new gutil.File({
                        cwd: __dirname,
                        base: path.join(__dirname),
                        path: path.join(__dirname, options.lang + '.json'),
                        contents: new Buffer(JSON.stringify(merge))
                    }));
                });

        }

        // callback();
    });
}

module.exports = gulpSyncLoco;
