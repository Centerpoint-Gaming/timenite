$("#full-countdown, .messageAfterEnd").hide();

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
    if (!Date.parse(settings.date)) {
      $.error("Incorrect date format, it should look - MM/DD/YYYY 12:00:00");
    }
    var container = this;
    var currentDate = function () {
      var date = new Date(),
        utc = date.getTime() + date.getTimezoneOffset() * 60000;
      return new Date(utc + 3600000 * settings.offset);
    };
    function countdown() {
      var target_date = new Date(settings.date),
        current_date = currentDate(),
        difference = target_date - current_date;
      if (difference < 0) {
        clearInterval(interval);
        if (callback && typeof callback === "function") callback();
        return;
      }
      var _second = 1000,
        _minute = _second * 60,
        _hour = _minute * 60,
        _day = _hour * 24;
      var days = Math.floor(difference / _day),
        hours = Math.floor((difference % _day) / _hour),
        minutes = Math.floor((difference % _hour) / _minute),
        seconds = Math.floor((difference % _minute) / _second);
      var text_days = days === 1 ? settings.day : settings.days,
        text_hours = hours === 1 ? settings.hour : settings.hours,
        text_minutes = minutes === 1 ? settings.minute : settings.minutes,
        text_seconds = seconds === 1 ? settings.second : settings.seconds;
      days = String(days).length >= 2 ? days : "0" + days;
      hours = String(hours).length >= 2 ? hours : "0" + hours;
      minutes = String(minutes).length >= 2 ? minutes : "0" + minutes;
      seconds = String(seconds).length >= 2 ? seconds : "0" + seconds;
      var total_time = Date.parse(settings.date) - Date.now(),
        time_remaining = Math.max(0, total_time),
        percent_remaining = (time_remaining / total_time) * 100;
      container.find(".progress-bar").css("width", percent_remaining + "%");
      container.find(".days-left").text(days);
      container.find(".hours").text(hours);
      container.find(".minutes").text(minutes);
      container.find(".seconds").text(seconds);
      container.find(".days_text").text(text_days);
      container.find(".hours_text").text(text_hours);
      container.find(".minutes_text").text(text_minutes);
      container.find(".seconds_text").text(text_seconds);
    }
    var interval = setInterval(countdown, 0);
  };
})($);

$(".days-left").on("text", () => {
  alert("Changed!");
});

document.addEventListener("DOMContentLoaded", function () {
  var $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach((el) => {
      el.addEventListener("click", () => {
        var $target = document.getElementById(el.dataset.target);
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
});

document.querySelectorAll(".navbar-link").forEach((navbarLink) => {
  navbarLink.addEventListener("click", () => {
    navbarLink.nextElementSibling.classList.toggle("is-hidden-mobile");
  });
});

$(document).ready(() => {
  document.getElementById("full-countdown").classList.remove("hider");
});

async function getSeasonNumber() {
  let seasonNumberAPI = 26;
  document.getElementById("seasonNumber").innerHTML =
    "Season " + seasonNumberAPI;
  seasonNumberAPI += 18;
  seasonNumberAPI = seasonNumberAPI.toString();
  let chapterNumber = seasonNumberAPI.slice(0, 1),
    seasonNumber = seasonNumberAPI.slice(1, 2);
  seasonNumber = seasonNumber == 0 ? 10 : seasonNumber;
  document.getElementById("seasonName").innerHTML =
    "Chapter " + chapterNumber + " Season " + seasonNumber + " Progress";
}

async function getSeasonEnd() {
  let calenderAPI = "2023-08-25T06:00:00Z";
  calenderAPI = calenderAPI.replace("T", " ").replace("Z", " ");
  var date = new Date(calenderAPI.replace(/-/g, "/"));
  date.setHours(date.getHours() + 3);
  date.setMinutes(date.getMinutes() - 0);
  let rawDate = new Date(date),
    processedDate =
      rawDate.getMonth() +
      1 +
      "/" +
      rawDate.getDate() +
      "/" +
      rawDate.getFullYear() +
      " " +
      rawDate.toLocaleTimeString();
  $(document).ready(() => {
    $(".content-loader").hide();
    $("#full-countdown").show();
    document.getElementById("seasonTime").innerHTML = date;
  });
  return processedDate;
}

async function printToFront() {
  $(".messageAfterEnd").hide();
  let fetchedTime = "10/11/2023 06:00:00";
  $(".content-loader").hide();
  $("#full-countdown").show();
  $("#full-countdown").countdown(
    { date: fetchedTime, day: "Day", days: "Days" },
    function () {
      timeIsOver();
    }
  );
}

function timeIsOver() {
  $("#full-countdown").hide();
  $(".messageAfterEnd").show();
}

printToFront();
getSeasonNumber();

setInterval(async function () {
  await printToFront();
}, 30000);
