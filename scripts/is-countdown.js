var today = new Date();
var tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
var day = tomorrow.getDate();
var month = tomorrow.getMonth() + 1;
var year = tomorrow.getFullYear();

var nextday = month + '/' + day + '/' + year + ' 00:00:00';

$('#example').countdown({
    date: nextday,
    day: 'Day',
    days: 'Days'
}, function () {
    day++;
});