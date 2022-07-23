// For Daily Item Shop
var today = new Date();
var tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
var day = tomorrow.getDate();
var month = tomorrow.getMonth() + 1;
var year = tomorrow.getFullYear();

var nextday = month + '/' + day + '/' + year + ' 00:03:00';

$('#clock').countdown({
  date: nextday,
  day: 'Day',
  days: 'Days'
},

  function () {
    day++;
  });

  

// For Daily Item Shop Preview
var today = new Date();
var tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
var day = tomorrow.getDate();
var month = tomorrow.getMonth() + 1;
var year = tomorrow.getFullYear();

var nextday = month + '/' + day + '/' + year + ' 00:00:00';

$('#clockgame').countdown({
  date: nextday,
  day: 'Day',
  days: 'Days'
},

  function () {
    day++;
    location.reload();
  });



// Hides loader after image loads.
$(document).ready(function () {
  var tmpImg = new Image();
  tmpImg.src = $('#item-shop-preview').attr('href');
  tmpImg.onload = function () {
    $(".content-loader").hide();
  };
});



// $(document).ready(function () {
//     $(".content-loader").hide();
// });