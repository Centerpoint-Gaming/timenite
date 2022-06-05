	var now = new Date();
		var day = now.getDate();
		var month = now.getMonth() + 1;
		var year = now.getFullYear() + 1;

		var nextyear = month + '/' + day + '/' + year + ' 07:07:07';

		$('#example').countdown({
			date: '10/02/22 20:12:00', 
			// ^ Change this to tweak the upcoming Season's time in UTC 00:00 
			// Date format: 07/27/2017 17:00:00

			// offset: +3, 
			// ^ Additional Timezone Offset

			day: 'Day',
			days: 'Days'
		}, function () {
			alert('Well, time to wait!');
		});