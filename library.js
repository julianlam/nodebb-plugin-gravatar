'use strict';

const user = require.main.require('./src/user');
const meta = require.main.require('./src/meta');
const db = require.main.require('./src/database');
const winston = require.main.require('winston');
const async = require('async');
const crypto = require('crypto');

const controllers = require('./lib/controllers');

const plugin = {};

plugin.init = async (params) => {
	const { router } = params;
	const hostMiddleware = params.middleware;

	router.get('/admin/plugins/gravatar', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/gravatar', controllers.renderAdminPage);
};

plugin.addAdminNavigation = async (header) => {
	header.plugins.push({
		route: '/plugins/gravatar',
		icon: 'fa-picture',
		name: 'Gravatar',
	});

	return header;
};

plugin.list = async (data) => {
	const { email, username } = await user.getUserFields(data.uid, ['email', 'username']);
	data.pictures.push({
		type: 'gravatar',
		url: await getGravatarUrl(email, username),
		text: 'Gravatar',
	});

	return data;
};

plugin.get = async (data) => {
	console.log(data);
	if (data.type === 'gravatar') {
		const { email, username } = await user.getUserFields(data.uid, ['email', 'username']);
		data.picture = await getGravatarUrl(email, username);
	}

	return data;
};

plugin.updateUser = async (data) => {
	const { default: useDefault } = await meta.settings.get('gravatar');
	if (useDefault === 'on') {
		winston.verbose(`[plugin/gravatar] Updating uid ${data.user.uid} to use gravatar`);
		data.user.picture = await getGravatarUrl(data.user.email, data.user.username);
	}

	return data;
};

plugin.onForceEnabled = async (users) => {
	const { default: useDefault, force } = await meta.settings.get('gravatar');

	if (force === 'on') {
		users = await Promise.all(users.map(async (userObj) => {
			if (!userObj) {
				return userObj;
			}

			if (!userObj.email) {
				const email = await db.getObjectField(`user:${userObj.uid}`, 'email');
				userObj.picture = await getGravatarUrl(email, userObj.username);
			} else {
				userObj.picture = await getGravatarUrl(userObj.email, userObj.username);
			}

			return userObj;
		}));
	} else if (plugin.hasOwnProperty('settings') && useDefault === 'on') {
		users = await Promise.all(users.map(async (userObj) => {
			if (!userObj) {
				return userObj;
			}

			if (userObj.picture === null || userObj.picture === '') {
				if (!userObj.email) {
					const email = await db.getObjectField(`user:${userObj.uid}`, 'email');
					userObj.picture = await getGravatarUrl(email, userObj.username);
				} else {
					userObj.picture = await getGravatarUrl(userObj.email, userObj.username);
				}
			}

			return userObj;
		}));
	}

	return users;
};

async function getGravatarUrl(userEmail, username) {
	console.log(userEmail, username);
	const email = userEmail || '';
	const size = parseInt(meta.config.profileImageDimension, 10) || 128;
	let baseUrl = `https://www.gravatar.com/avatar/${sum(email)}?size=192`;
	let { customDefault, iconDefault } = await meta.settings.get('gravatar');

	if (customDefault) {
		// If custom avatar provider is a URL, replace possible variables with values.
		if (customDefault.indexOf('http') === 0) { // Use explicit check for increased readability.
			customDefault = customDefault.replace(/%md5/i, sum(email));
			customDefault = customDefault.replace(/%email/i, email);
			customDefault = customDefault.replace(/%user/i, username);
			customDefault = customDefault.replace(/%size/i, size);
			customDefault = customDefault.replace(/%userhash/i, sum(username));
		}
		baseUrl += `&d=${encodeURIComponent(customDefault)}`;
	} else if (iconDefault) {
		baseUrl += `&d=${iconDefault}`;
	}

	console.log(baseUrl);
	return baseUrl;
}

function sum(email) {
	let md5sum = crypto.createHash('md5');
	md5sum.update(String(email).trim().toLowerCase());
	md5sum = md5sum.digest('hex');
	return md5sum;
}

module.exports = plugin;
