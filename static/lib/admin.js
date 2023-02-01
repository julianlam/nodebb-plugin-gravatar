'use strict';

define('admin/plugins/gravatar', ['settings'], function (Settings) {
	var ACP = {};

	ACP.init = function () {
		Settings.load('gravatar', $('.gravatar-settings'));

		$('#save').on('click', function () {
			Settings.save('gravatar', $('.gravatar-settings'), function () {
				app.alert({
					type: 'success',
					alert_id: 'gravatar-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function () {
						socket.emit('admin.reload');
					},
				});
			});
		});
	};

	return ACP;
});
