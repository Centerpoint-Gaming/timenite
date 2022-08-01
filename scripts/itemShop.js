
(function ($) {
  $.fn.countdown = function (options, callback) {
    let settings = $.extend(
      {
        date: null,
        offset: null,
        day: "Day",
        days: "Days",
        hour: "Hour",
        hours: "Hours",
        minute: "Minute",
        minutes: "Minutes",
        second: "Second",
        seconds: "Seconds",
      },
      options
    );



    // Throw error if date is set incorectly
    if (!Date.parse(settings.date)) {
      $.error("Incorrect date format, it should look - MM/DD/YYYY 12:00:00.");
    }

    // Save container
    var container = this;
    /**
     * Change client's local date to match offset timezone
     * @return {Object} Fixed Date object.
     */
    var currentDate = function () {
      // Client's local date.
      var date = new Date();
      // Into UTC
      var utc = date.getTime() + date.getTimezoneOffset() * 60000;
      var new_date = new Date(utc + 3600000 * settings.offset);

      return new_date;
    };

    function countdown() {
      var target_date = new Date(settings.date), // set target date
        current_date = currentDate(); // get fixed current date

      // difference of dates
      var difference = target_date - current_date;

      if (difference < 0) {
        clearInterval(interval);
        if (callback && typeof callback === "function") callback();
        return;
      }

      // basic math variables
      var _second = 1000,
        _minute = _second * 60,
        _hour = _minute * 60,
        _day = _hour * 24;

      // calculate dates
      var days = Math.floor(difference / _day),
        hours = Math.floor((difference % _day) / _hour),
        minutes = Math.floor((difference % _hour) / _minute),
        seconds = Math.floor((difference % _minute) / _second);

      // based on the date change the refrence wording
      var text_days = days === 1 ? settings.day : settings.days,
        text_hours = hours === 1 ? settings.hour : settings.hours,
        text_minutes = minutes === 1 ? settings.minute : settings.minutes,
        text_seconds = seconds === 1 ? settings.second : settings.seconds;

      // fix dates so that it will show two digets
      days = String(days).length >= 2 ? days : "0" + days;
      hours = String(hours).length >= 2 ? hours : "0" + hours;
      minutes = String(minutes).length >= 2 ? minutes : "0" + minutes;
      seconds = String(seconds).length >= 2 ? seconds : "0" + seconds;

      // set to DOM
      container.find(".days-left").text(days);
      container.find(".hours").text(hours);
      container.find(".minutes").text(minutes);
      container.find(".seconds").text(seconds);

      container.find(".days_text").text(text_days);
      container.find(".hours_text").text(text_hours);
      container.find(".minutes_text").text(text_minutes);
      container.find(".seconds_text").text(text_seconds);
    }

    // start
    var interval = setInterval(countdown, 0);
  };
})($);


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



$('#item-shop-preview').hide();



// Hides loader after tweet/image loads.
$(document).ready(function () {
  var tmpImg = new Image();
  tmpImg.src = $('#item-shop-preview').attr('src');
  tmpImg.onload = function () {
    $(".content-loader").hide();
    $('#item-shop-preview').show();
  };
});



// Auto Dark/light mode for tweets
// if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//   document.getElementById("tweet").setAttribute("data-theme", "dark");
//  }  


//   if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
//     document.getElementById("tweet").setAttribute("data-theme", "light"); }  
  


//  For Navbar
document.addEventListener("DOMContentLoaded", function () {
  var $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener("click", function () {
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        $el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});

document.querySelectorAll(".navbar-link").forEach(function (navbarLink) {
  navbarLink.addEventListener("click", function () {
    navbarLink.nextElementSibling.classList.toggle("is-hidden-mobile");
  });
});