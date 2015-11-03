"use strict";

var plugin = {};

plugin.list = function(data, callback) {
	data.pictures.push({
		type: 'catatar',
		url: 'http://thecatapi.com/api/images/get?format=src&type=gif',
		text: 'Random Cat Picture'
	});

	callback(null, data);
};

plugin.get = function(data, callback) {
	if (data.type === 'catatar') {
		data.picture = 'http://thecatapi.com/api/images/get?format=src&type=gif';
	}

	callback(null, data);
};

module.exports = plugin;