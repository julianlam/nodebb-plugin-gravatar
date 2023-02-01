'use strict';

define('admin/plugins/gravatar', ['settings'], function (Settings) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('gravatar', $('.gravatar-settings'));

		$('#save').on('click', function () {
			Settings.save('gravatar', $('.gravatar-settings'));
		});
	};

	return ACP;
});
