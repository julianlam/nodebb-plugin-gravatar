"use strict";

var user = module.parent.require('./user'),
	crypto = require('crypto'),

	plugin = {};

plugin.list = function(data, callback) {
	user.getUserField(data.uid, 'email', function(err, email) {
		data.pictures.push({
			type: 'gravatar',
			url: 'http://www.gravatar.com/avatar/' + sum(email) + '?size=192',
			text: 'Gravatar'
		});

		callback(null, data);
	});
};

plugin.get = function(data, callback) {
	if (data.type === 'gravatar') {
		user.getUserField(data.uid, 'email', function(err, email) {
			data.picture = 'http://www.gravatar.com/avatar/' + sum(email) + '?size=192';
			callback(null, data);
		});
	} else {
		callback(null, data);
	}
};

function sum(email) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(email);
	md5sum = md5sum.digest('hex');
	return md5sum;
}

module.exports = plugin;