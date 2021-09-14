	var now = new Date();
		var day = now.getDate();
		var month = now.getMonth() + 1;
		var year = now.getFullYear() + 1;

		var nextyear = month + '/' + day + '/' + year + ' 07:07:07';

		$('#example').countdown({
			date: '12/05/21 20:05:00', // TODO Date format: 07/27/2017 17:00:00
			// offset: +3, // TODO Your Timezone Offset
			day: 'Day',
			days: 'Days'
		}, function () {
			alert('Any Minute Now!');
		});