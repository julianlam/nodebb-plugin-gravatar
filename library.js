"use strict";

var user = module.parent.require('./user'),
	meta = module.parent.require('./meta'),
	winston = module.parent.require('winston'),
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
			url: 'https://www.gravatar.com/avatar/' + sum(email) + '?size=192',
			text: 'Gravatar'
		});

		callback(null, data);
	});
};

plugin.get = function(data, callback) {
	if (data.type === 'gravatar') {
		user.getUserField(data.uid, 'email', function(err, email) {
			data.picture = 'https://www.gravatar.com/avatar/' + sum(email) + '?size=192';
			callback(null, data);
		});
	} else {
		callback(null, data);
	}
};

plugin.updateUser = function(data, callback) {
	if (plugin.settings.default === 'on') {
		winston.verbose('[plugin/gravatar] Updating uid ' + data.user.uid + ' to use gravatar');
		data.user.picture = 'https://www.gravatar.com/avatar/' + sum(data.user.email) + '?size=192';
		callback(null, data);
	} else {
		// No transformation
		callback(null, data);
	}
};

plugin.onForceEnabled = function(users, callback) {
	if (plugin.settings.force === 'on') {
		users = users.map(function(user) {
			if (user.hasOwnProperty('picture')) {
				winston.verbose('[plugin/gravatar] Forcing use of Gravatar (uid: ' + user.uid + ')');
				user.picture = 'https://www.gravatar.com/avatar/' + sum(user.email || '') + '?size=192';
			}

			return user;
		});

		callback(null, users);
	} else {
		// No transformation
		callback(null, users);
	}
}

function sum(email) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(email);
	md5sum = md5sum.digest('hex');
	return md5sum;
}

module.exports = plugin;