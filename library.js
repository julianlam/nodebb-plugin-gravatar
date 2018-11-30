"use strict";

var user = require.main.require('./src/user'),
	meta = require.main.require('./src/meta'),
	db = require.main.require('./src/database'),
	winston = require.main.require('winston'),
	async = require.main.require('async'),
	crypto = require('crypto'),

	controllers = require('./lib/controllers'),
	plugin = {};

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;

	router.get('/admin/plugins/gravatar', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/gravatar', controllers.renderAdminPage);

	meta.settings.get('gravatar', function(err, settings) {
		if (err) {
			winston.error('[plugin/gravatar] Could not retrieve plugin settings! Using defaults.');
			plugin.settings = {
				default: false,
				force: false
			};
			return;
		}

		plugin.settings = settings;
	});

	callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/gravatar',
		icon: 'fa-picture',
		name: 'Gravatar'
	});

	callback(null, header);
};

plugin.list = function(data, callback) {
	user.getUserFields(data.uid, ['email', 'username'], function(err, userData) {
		data.pictures.push({
			type: 'gravatar',
			url: getGravatarUrl(userData.email, userData.username),
			text: 'Gravatar'
		});

		callback(null, data);
	});
};

plugin.get = function(data, callback) {
	if (data.type === 'gravatar') {
		user.getUserFields(data.uid, ['email', 'username'], function(err, userData) {
			data.picture = getGravatarUrl(userData.email, userData.username);
			callback(null, data);
		});
	} else {
		callback(null, data);
	}
};

plugin.updateUser = function(data, callback) {
	if (plugin.settings.default === 'on') {
		winston.verbose('[plugin/gravatar] Updating uid ' + data.user.uid + ' to use gravatar');
		data.user.picture = getGravatarUrl(data.user.email, data.user.username);
		callback(null, data);
	} else {
		// No transformation
		callback(null, data);
	}
};

plugin.onForceEnabled = function(users, callback) {
	if (plugin.hasOwnProperty('settings') && plugin.settings.force === 'on') {
		async.map(users, function(userObj, next) {
			if (!userObj) {
				return next(null, userObj);
			}

			if (!userObj.email) {
				db.getObjectField('user:' + userObj.uid, 'email', function(err, email) {
					userObj.picture = getGravatarUrl(email, userObj.username);
					next(null, userObj);
				});
			} else {
				userObj.picture = getGravatarUrl(userObj.email, userObj.username);
				next(null, userObj);
			}
		}, callback);
	} else if (plugin.hasOwnProperty('settings') && plugin.settings.default === 'on') {
		async.map(users, function(userObj, next) {
			if (!userObj) {
				return next(null, userObj);
			}

			if (userObj.picture === '') {
				if (!userObj.email) {
					db.getObjectField('user:' + userObj.uid, 'email', function(err, email) {
						userObj.picture = getGravatarUrl(email, userObj.username);
						next(null, userObj);
					});
				} else {
					userObj.picture = getGravatarUrl(userObj.email, userObj.username);
					next(null, userObj);
				}
			} else {
				setImmediate(next, null, userObj);
			}
		}, callback);
	} else {
		// No transformation
		callback(null, users);
	}
}

function getGravatarUrl(userEmail, username) {
	var email = userEmail || "",
		size = parseInt(meta.config.profileImageDimension, 10) || 128,
		baseUrl = 'https://www.gravatar.com/avatar/' + sum(email) + '?size=192',
		customDefault = plugin.settings.customDefault;

	if (customDefault) {
		// If custom avatar provider is a URL, replace possible variables with values.
		if (customDefault.indexOf('http') == 0) { //Use explicit check for increased readability.
			customDefault = customDefault.replace(/%md5/i, sum(email));
			customDefault = customDefault.replace(/%email/i, email);
			customDefault = customDefault.replace(/%user/i, username);
			customDefault = customDefault.replace(/%size/i, size);
			customDefault = customDefault.replace(/%userhash/i, sum(username));
		}
		baseUrl += '&d=' + encodeURIComponent(customDefault);
	} else if (plugin.settings.iconDefault) {
		baseUrl += '&d=' + plugin.settings.iconDefault;
	}

	return baseUrl;
};

function sum(email) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(String(email).trim().toLowerCase());
	md5sum = md5sum.digest('hex');
	return md5sum;
}

module.exports = plugin;
