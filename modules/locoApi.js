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
    this.apiKey = String(key).replace(/(\r\n|\n|\r)/gm,"");
    this.baseUrl = 'https://localise.biz/api';
}

locoApi.prototype.getLocales = function () {
    var options = {
        method: 'GET',
        qs: {
            key: this.apiKey
        },
        uri: this.baseUrl + '/locales'
    };
    return request(options);
};

locoApi.prototype.addLocale = function (localeData) {
    var self = this;
    var options = {
        method: 'POST',
        qs: {
            key: this.apiKey
        },
        form: localeData,
        uri: this.baseUrl + '/locales'
    };

    return request(options);
};

locoApi.prototype.exportLocale = function (locale, tags) {
    var options = {
        method: 'GET',
        qs: {
            filter: tags.join(', '),
            format: 'getText',
            key: this.apiKey
        },
        uri: this.baseUrl + '/export/locale/' + locale + '.json'
    };

    return request(options);
};

locoApi.prototype.getTags = function () {
    var options = {
        method: 'GET',
        qs: {
            key: this.apiKey
        },
        uri: this.baseUrl + '/tags'
    };
    return request(options);
};

locoApi.prototype.createTag = function (tag) {
    var self = this;
    var options = {
        method: 'POST',
        qs: {
            key: this.apiKey
        },
        form: tag,
        uri: this.baseUrl + '/tags'
    };

    return request(options);
};

locoApi.prototype.importAsync = function (locale, assets) {
    var self = this;
    var options = {
        method: 'POST',
        qs: {
            key: this.apiKey
        },
        form: {
            async: true,
            locale: locale,
            src: JSON.stringify(assets)
        },
        uri: this.baseUrl + '/import/json'
    };

    return request(options);
};

locoApi.prototype.importProgress = function (id) {
    // body...
};

/**
 * Get all assets of tags given.
 * @param  {array} tags Array of tags.
 */
locoApi.prototype.getAssets = function (tags) {
    var options = {
        method: 'GET',
        qs: {
            filter: tags.join(', '),
            key: this.apiKey
        },
        uri: this.baseUrl + '/assets'
    };

    return request(options);
};

locoApi.prototype.tagAsset = function (assetId, tag) {
    var self = this;
    var options = {
        method: 'POST',
        qs: {
            key: this.apiKey
        },
        form: {
            name: tag
        },
        uri: this.baseUrl + '/assets/' + assetId + '/tags'
    };

    return request(options);
};

locoApi.prototype.setStatus = function (translationId, flag, locale) {
    var self = this;
    var options = {
        method: 'POST',
        qs: {
            key: this.apiKey
        },
        form: {
            flag: flag
        },
        uri: this.baseUrl + '/translations/' + translationId + '/' + locale + '/flag'
    };

    return request(options);
};

module.exports = locoApi;
