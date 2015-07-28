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
    this.locales = options.lang;
    this.api = new locoApi(options.apiKey);
}

module.exports = Synchronizr;
