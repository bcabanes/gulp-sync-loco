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
    this.baseUrl = 'https://localise.biz/api';
}

locoApi.prototype.getLocales = function () {
    var options = {
        method: 'GET',
        uri: this.baseUrl + '/locales?key=' + this.apiKey
    };
    return request(options);
};

locoApi.prototype.addLocale = function (localeData) {
    var self = this;
    var options = {
        method: 'POST',
        form: localeData,
        uri: this.baseUrl + '/locales?key=' + this.apiKey
    };

    return request(options);
};

locoApi.prototype.exportLocale = function (locale, extension, tags) {
    // body...
};

locoApi.prototype.getTags = function () {
    var options = {
        method: 'GET',
        uri: this.baseUrl + '/tags?key=' + this.apiKey
    };
    return request(options);
};

locoApi.prototype.createTag = function (tag) {
    var self = this;
    var options = {
        method: 'POST',
        form: tag,
        uri: this.baseUrl + '/tags?key=' + this.apiKey
    };

    return request(options);
};

locoApi.prototype.importAsync = function (locale, assets) {
    var self = this;
    var options = {
        method: 'POST',
        form: {
            async: true,
            locale: locale,
            src: JSON.stringify(assets)
        },
        uri: this.baseUrl + '/import/json?key=' + this.apiKey
    };

    return request(options);
};

locoApi.prototype.importProgress = function (id) {
    // body...
};

locoApi.prototype.exportLocale = function (locale, extension, tags) {
    var options = {
        method: 'GET',
        qs: {
            filter: tags.join(', ')
        },
        uri: this.baseUrl + '/export/locale/' + locale + '.' + extension + '?key=' + this.apiKey
    };

    return request(options);
};

/**
 * Get all assets of tags given.
 * @param  {array} tags Array of tags.
 */
locoApi.prototype.getAssets = function (tags) {
    var options = {
        method: 'GET',
        qs: {
            filter: tags.join(', ')
        },
        uri: this.baseUrl + '/assets?key=' + this.apiKey
    };

    return request(options);
};

locoApi.prototype.tagAsset = function (assetId, tag) {
    var self = this;
    var options = {
        method: 'POST',
        form: {
            name: tag
        },
        uri: this.baseUrl + '/assets/' + assetId + '/tags?key=' + this.apiKey
    };

    return request(options);
};

locoApi.prototype.setStatus = function (translationId, flag, locale) {
    var self = this;
    var options = {
        method: 'POST',
        form: {
            flag: flag
        },
        uri: this.baseUrl + '/translations/' + translationId + '/' + locale + '/flag?key=' + this.apiKey
    };

    return request(options).catch(function (response) {
gutil.log(chalk.red(JSON.stringify(response)));
    });
};

module.exports = locoApi;
