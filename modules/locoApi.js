'use strict';
var _ = require('lodash');
var chalk = require('chalk');
var gutil = require('gulp-util');
var request = require('request-promise');

/**
 * Loco Api
 * This is a basic service to call the REST Loco API.
 */
function locoApi (key) {
    if (!key) {
        throw new gutil.PluginError('Loco API',
            chalk.red('You must have an API key to use Loco API.'));
    }

    /* jshint validthis: true */
    this.apiKey = key;
}

locoApi.prototype.getLocales = function () {
    // body...
};

locoApi.prototype.exportLocale = function (locale, extension, tags) {
    // body...
};

locoApi.prototype.addLocale = function (locale) {
    // body...
};

locoApi.prototype.getTags = function () {
    // body...
};

locoApi.prototype.createTag = function (tagName) {
    // body...
};

locoApi.prototype.importAsync = function (locale, assets) {
    // body...
};

locoApi.prototype.importProgress = function (id) {
    // body...
};

/**
 * Get all assets of tags given.
 * @param  {array} tags Array of tags.
 */
locoApi.prototype.getAssets = function (tags) {
    // body...
};

locoApi.prototype.tagAsset = function (id, tag) {
    // body...
};

locoApi.prototype.setStatus = function (assetId, flag, locale) {
    // body...
};

module.exports = locoApi;
