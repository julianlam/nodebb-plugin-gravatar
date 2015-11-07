"use strict";

var user = module.parent.require('./user'),
	meta = module.parent.require('./meta'),
	db = module.parent.require('./database'),
	winston = module.parent.require('winston'),
	async = module.parent.require('async'),
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
	user.getUserField(data.uid, 'email', function(err, email) {
		data.pictures.push({
			type: 'gravatar',
			url: getGravatarUrl(email),
			text: 'Gravatar'
		});

		callback(null, data);
	});
};

plugin.get = function(data, callback) {
	if (data.type === 'gravatar') {
		user.getUserField(data.uid, 'email', function(err, email) {
			data.picture = getGravatarUrl(email);
			callback(null, data);
		});
	} else {
		callback(null, data);
	}
};

plugin.updateUser = function(data, callback) {
	if (plugin.settings.default === 'on') {
		winston.verbose('[plugin/gravatar] Updating uid ' + data.user.uid + ' to use gravatar');
		data.user.picture = getGravatarUrl(data.user.email);
		callback(null, data);
	} else {
		// No transformation
		callback(null, data);
	}
};

plugin.onForceEnabled = function(users, callback) {
	if (plugin.settings.force === 'on') {
		async.map(users, function(userObj, next) {
			if (!userObj.email) {
				db.getObjectField('user:' + userObj.uid, 'email', function(err, email) {
					userObj.picture = getGravatarUrl(email);
					next(null, userObj);
				});
			} else {
				userObj.picture = getGravatarUrl(userObj.email);
				next(null, userObj);
			}
		}, callback);
	} else {
		// No transformation
		callback(null, users);
	}
}

function getGravatarUrl(email) {
	var baseUrl = 'https://www.gravatar.com/avatar/' + sum(email || '') + '?size=192';

	if (plugin.settings.customDefault) {
		baseUrl += '&d=' + encodeURIComponent(plugin.settings.customDefault);
	} else if (plugin.settings.iconDefault) {
		baseUrl += '&d=' + plugin.settings.iconDefault;
	}

	return baseUrl;
};

function sum(email) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(email);
	md5sum = md5sum.digest('hex');
	return md5sum;
}

module.exports = plugin;