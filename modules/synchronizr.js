'use strict';
var _ = require('lodash');
var chalk = require('chalk');
var gutil = require('gulp-util');
var request = require('request-promise');
var stringify = require('json-stable-stringify');
var through = require('through2');

/**
 * Interns.
 */
var locoApi = require('./locoApi');

/**
 * Synchronizr
 * This synchronize the local json token with Loco.
 * @param {object} options Synchronize Loco's options.
 *
 * How the synchronization works?
 * This synchronization is mastered by Loco (http://localise.biz), that is to
 * say the right tokens are always from Loco. You can't erease tokens by simply
 * removes it from the json file, you should do it from Loco.
 *
 * This synchronization processes by multiple tasks:
 * 1. Check if locales given in options are comprised in Loco's locales.
 * If not, add this locale to Loco. All Loco's locales are in 'xx_XX' format
 * like 'en_CA', so your locale in 'xx' like 'en' should be converted to Loco's
 * format.
 *
 * 2. Get all tags available from Loco. If the the tags given in options aren't
 * in Loco yet, create it first. Loco will ignore not existing tags otherwise.
 *
 * 3. Get all remote catalogs associated to the locale. Then for each assets in
 * a catalog, test if the assets is already defined in your json file. You have
 * to convert null asset's values to empty string "" because Loco will not
 * import null value.
 *
 * 4. Import to Loco the processed assets.
 *
 * 5. Tag assets (tag+fuzzy).
 *
 * 6. Finaly, get remote catalog of assets from Loco to write the new json
 * localization file with translations.
 */
function Synchronizr (options) {
    this.api = new locoApi(options.apiKey);
}

/**
 * TODO: use mapping like [en][en_US, en_CA] ...
 */
Synchronizr.prototype.convertLocale = function (locale) {
    return locale + '_CA';
};

Synchronizr.prototype.testLocale = function (locale) {
    var self = this,
        convertedLocale = this.convertLocale(locale),
        locoLocales = [];

    this.api
        .getLocales()
        .then(function (apiLocales) {
            _.each(apiLocales, function (apiLocale) {
                locoLocales.push(apiLocale.code);
            });

            if (locoLocales.indexOf(convertedLocale) === -1) {
                locoLocales.push(convertedLocale);
                self.api
                    .addLocale({code: convertedLocale});
            }
        });

    gutil.log('locales: ', this.locales);
};

Synchronizr.prototype.createTags = function () {
    var self = this,
        tags = ['webapp'];

    this.api
        .getTags()
        .then(function (apiTags) {
            _.each(tags, function (tag) {
                if (apiTags.indexOf(tag) === -1) {
                    self.api
                        .createTag({name: tag});
                }
            });
        });
}

Synchronizr.prototype.sync = function (tags, content) {
    var self = this;

    this.api
        .getAssets(tags)
        .then(function (apiAssets) {
            var fileTokens = _.clone(content);
            _.each(content, function (assetValue, assetToken) {
                _.each(apiAssets, function(apiAsset) {
                    if (apiAsset.name === assetToken) {
                        gutil.log(chalk.yellow(
                            'Skip existing asset ' + assetToken
                        ));
                        delete fileTokens[assetToken];
                    }
                });

                // TODO: make this an option.
                // Will not import null value.
                if (typeof assetValue === null) {
                    fileTokens[assetToken] = '';
                }

                gutil.log(chalk.yellow(
                    'Import asset: ' + assetToken
                ));
            });

            // Import tokens to api.
            self.api
                .importAsync('fr_CA', fileTokens)
                .then(function () {
                    // Tag new tokens and set them to fuzzy status.
                    _.each(fileTokens, function (token, tokenKey) {
                        _.each(tags, function (tag) {
                            self.api
                                .tagAsset(tokenKey, tag);
                        });

                        if (token !== '') {
                            self.api
                                .setStatus(tokenKey, 'fuzzy', 'fr_CA');
                        }
                    });

                });
        });
};

module.exports = Synchronizr;
