$("#full-countdown").hide();


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

$(".days-left").on("text", function (e) {
  alert("Changed!");
});

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

jQuery(document).ready(function () {
  document.getElementById("full-countdown").classList.remove("hider");
});



// For fetching Fortnite season's end.
async function getSeasonNumber() {
  let seasonNumberAPI = await fetch("https://fn-api.com/api/calendar")
    .then((res) => res.json())
    .then((json) => {
      return json.data.channels["client-events"]["states"][0]["state"]["seasonNumber"];
    });

    document.getElementById("seasonNumber").innerHTML = "(Season " + ++seasonNumberAPI + ")"

   
    seasonNumberAPI = await seasonNumberAPI + 12;
    seasonNumberAPI = seasonNumberAPI.toString();

    let chapterNumber = seasonNumberAPI.slice(0, 1);
    let seasonNumber = seasonNumberAPI.slice(1, 2);

    document.getElementById("seasonName").innerHTML = "Chapter " + seasonNumber + " Season " + seasonNumber;

}



// For fetching Fortnite season's end.
async function getSeasonEnd() {
  let calenderAPI = await fetch("https://fn-api.com/api/calendar")
    .then((res) => res.json())
    .then((json) => {
      return json.data.channels["client-events"]["states"][0]["state"]["seasonDisplayedEnd"];
    });

  calenderAPI = await calenderAPI.replace("T", " ");
  calenderAPI = await calenderAPI.replace("Z", " ");
  calenderAPI = await calenderAPI.replaceAll("-", "/");
  calenderAPI = await calenderAPI.slice(2);

  let calenderDate = calenderAPI.slice(0, 8);
  let calenderTime = calenderAPI.slice(9, 17);
  let calenderDateYear = calenderDate.slice(0, 2);
  let calenderDateMonth = calenderDate.slice(3, 5);
  let calenderDateDay = calenderDate.slice(6, 8);

  calenderDate =
    calenderDateMonth + "/" + calenderDateDay + "/" + calenderDateYear;

  let finalTime = calenderDate + " " + calenderTime + " ";

  // Hides loader after countdown loads.
  $(document).ready(function () {
    $(".content-loader").hide();
    $("#full-countdown").show();
    document.getElementById("seasonTime").innerHTML = calenderDate + ' at ' + calenderTime;
    
  });
  return finalTime;
}

async function printToFront() {
  getSeasonNumber();

  let fetchedTime = await getSeasonEnd();

  // For Season
  var now = new Date();
  var day = now.getDate();
  var month = now.getMonth() + 1;
  var year = now.getFullYear() + 1;

  // var nextyear = month + '/' + day + '/' + year + ' 00:00:00';

console.log("Current season ends on " + fetchedTime);

  $("#full-countdown").countdown(
    {
      date: fetchedTime,
      // ^ Change this to tweak the upcoming Season's time in UTC 00:00
      // Date format: 07/27/2017 17:00:00
      offset: -4,
      // ^ Uncomment for additional timezone offset
      day: "Day",
      days: "Days"
    },
    function () {
      alert("Well, time to wait!");
    }
  );
}


printToFront();




// Updates every 30-seconds.
setInterval(async function () {
  await printToFront();
}, 30000);
